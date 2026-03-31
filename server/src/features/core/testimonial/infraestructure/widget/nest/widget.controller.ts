import {
  Controller,
  Get,
  Post,
  Query,
  Res,
  Inject,
  Req,
  UseInterceptors,
  UploadedFile,
  Header,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { randomUUID } from 'crypto';

import type { TestimonialRepository } from '../../../domain/ports/TestimonialRepository';
import { OrganizationId } from '../../../domain/value-objects/OrganizationId';
import { Public } from '../../../../../auth/infrastructure/nest/decorators/public.decorator';

import { Testimonial } from '../../../domain/Testimonial';
import { TestimonialId } from '../../../domain/value-objects/TestimonialId';
import { TestimonialContent } from '../../../domain/value-objects/TestimonialContent';
import { TestimonialAuthor } from '../../../domain/value-objects/TestimonialAuthor';
import { TestimonialRating } from '../../../domain/value-objects/TestimonialRating';
import {
  TestimonialStatus,
  TestimonialStatusEnum,
} from '../../../domain/value-objects/TestimonialStatus';
import {
  TestimonialCategory,
  TestimonialCategoryEnum,
} from '../../../domain/value-objects/TestimonialCategory';
import {
  TestimonialTag,
  TestimonialTagEnum,
} from '../../../domain/value-objects/TestimonialTag';
import { TestimonialIdempotencyKey } from '../../../domain/value-objects/TestimonialIdempotencyKey';
import { TestimonialIsEdited } from '../../../domain/value-objects/TestimonialIsEdited';
import { TestimonialCreatedAt } from '../../../domain/value-objects/TestimonialCreatedAt';
import { TestimonialImageUrl } from '../../../domain/value-objects/TestimonialImageUrl';
import type { MediaRepository } from 'src/features/media/domain/MediaRepository';
import { TestimonialVideoUrl } from '../../../domain/value-objects/TestimonialVideoUrl';

@Controller('widget')
export class WidgetController {
  constructor(
    @Inject('TestimonialRepository')
    private readonly testimonialRepository: TestimonialRepository,
    @Inject('MediaRepository')
    private readonly mediaRepository: MediaRepository,
  ) {}

  @Public()
  @Post('submit')
  @UseInterceptors(FileInterceptor('image'))
  async submit(
    @UploadedFile() image: Express.Multer.File | undefined,
    @Req() req: Request,
  ) {
    const { organizationId, author, content, rating, videoUrl } = req.body || {};

    if (!organizationId || !author || !content || !rating) {
      return { success: false, message: 'Missing required fields' };
    }

    let imageUrl: TestimonialImageUrl | undefined = undefined;
    if (image) {
      const uploadedUrl = await this.mediaRepository.uploadImage(image);
      if (uploadedUrl) {
        imageUrl = new TestimonialImageUrl(uploadedUrl);
      }
    }

    const testimonial = new Testimonial(
      new TestimonialId(randomUUID()),
      new TestimonialIdempotencyKey(randomUUID()),
      new TestimonialContent(content),
      new TestimonialAuthor(author),
      new TestimonialStatus(TestimonialStatusEnum.PENDING),
      [new TestimonialTag(TestimonialTagEnum.GENERAL)],
      new TestimonialRating(Number(rating)),
      new TestimonialCategory(TestimonialCategoryEnum.OTHER),
      new TestimonialIsEdited(false),
      new OrganizationId(organizationId),
      imageUrl,
      new TestimonialVideoUrl(videoUrl),
      new TestimonialCreatedAt(new Date()),
      undefined,
    );

    await this.testimonialRepository.create(testimonial);
    return { success: true, message: 'Testimonial submitted successfully' };
  }

  @Public()
  @Get('data')
  async getData(@Query('organizationId') organizationId: string) {
    if (!organizationId) return [];

    const testimonials = await this.testimonialRepository.findApprovedByOrganization(
      new OrganizationId(organizationId),
    );

    return testimonials.map((t) => ({
      id: t.id.value,
      content: t.content.value,
      author: t.author.value,
      rating: t.rating.value,
      imageUrl: t.imageUrl?.value,
    }));
  }

  @Public()
  @Get('embed.js')
  @Header('Content-Type', 'application/javascript')
  @Header('Access-Control-Allow-Origin', '*')
  getEmbed(@Res() res: Response) {
   const scriptContent = `
(function() {
  if (typeof window !== 'undefined' && !customElements.get('testimo-widget')) {
    class TestimoWidget extends HTMLElement {
      static get observedAttributes() {
        return ['organization-id', 'theme', 'layout', 'api-url'];
      }

      constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._data = [];
        this._aiSummary = '';
        this._loading = true;
        this._error = null;
        this._submitting = false;
        this.formListener = null;
        this.clickListeners = [];
      }

      connectedCallback() {
        this.fetchData();
        this.trackView();
      }

      disconnectedCallback() {
        this.removeAllListeners();
      }

      removeAllListeners() {
        if (this.formListener) {
          const form = this.shadowRoot?.getElementById('testimonial-form');
          if (form) form.removeEventListener('submit', this.formListener);
          this.formListener = null;
        }
        this.clickListeners.forEach(unlisten => unlisten());
        this.clickListeners = [];
      }

      get apiUrl() {
        return this.getAttribute('api-url') || window.location.origin;
      }

      attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
          if (name === 'organization-id' || name === 'api-url') {
            this.fetchData();
          } else {
            this.render();
          }
        }
      }

      async trackView() {
        const orgId = this.getAttribute('organization-id');
        if (!orgId) return;
        try {
          await fetch(\`\${this.apiUrl}/analytics/track\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              organizationId: orgId,
              testimonialId: 'all',
              type: 'view',
              metadata: { widget: true }
            })
          });
        } catch (e) {}
      }

      async fetchData() {
        const orgId = this.getAttribute('organization-id');
        if (!orgId) {
          this._error = 'Organization ID is missing';
          this._loading = false;
          this.render();
          return;
        }

        this._loading = true;
        this._error = null;
        this.render();

        try {
          const response = await fetch(\`\${this.apiUrl}/widget/data?organizationId=\${orgId}\`);
          if (!response.ok) throw new Error('Failed to fetch testimonials');
          this._data = await response.json();

          if (this._data.length > 0) {
            if (this._data.length === 1) {
              this._aiSummary = \`Las personas comentan que: "\${this._data[0].content}"\`;
            } else if (this._data.length === 2) {
              this._aiSummary = \`Las personas comentan que: "\${this._data[0].content}" y "\${this._data[1].content}"\`;
            } else {
              this._aiSummary = \`Las personas comentan que: "\${this._data[0].content}", "\${this._data[1].content}" y otros \${this._data.length - 2} testimonios más.\`;
            }
          } else {
            this._aiSummary = 'Aún no hay testimonios para analizar.';
          }
        } catch (err) {
          this._error = err.message || 'Failed to load testimonials';
        } finally {
          this._loading = false;
          this.render();
        }
      }

      _handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const orgId = this.getAttribute('organization-id');
        const feedback = this.shadowRoot?.getElementById('form-feedback');

        if (this._submitting || !orgId) return;

        this._submitting = true;
        const btn = form.querySelector('button');
        if (btn) {
          btn.disabled = true;
          btn.textContent = 'Enviando...';
        }

        try {
          formData.append('organizationId', orgId);
          const response = await fetch(\`\${this.apiUrl}/widget/submit\`, {
            method: 'POST',
            body: formData,
          });
          if (!response.ok) throw new Error('Failed to submit');
          form.reset();
          if (feedback) {
            feedback.textContent = '¡Gracias! Tu testimonio ha sido enviado para revisión.';
            feedback.className = 'success-msg';
          }
        } catch (err) {
          if (feedback) {
            feedback.textContent = 'Error al enviar el testimonio. Inténtalo de nuevo.';
            feedback.className = 'error-msg';
          }
        } finally {
          this._submitting = false;
          if (btn) {
            btn.disabled = false;
            btn.textContent = 'Enviar testimonio';
          }
        }
      };

      async trackClick(testimonialId) {
        const orgId = this.getAttribute('organization-id');
        if (!orgId || !testimonialId) return;
        try {
          await fetch(\`\${this.apiUrl}/analytics/track\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              organizationId: orgId,
              testimonialId,
              type: 'click',
              metadata: { widget: true }
            })
          });
        } catch (e) {}
      }

      render() {
        if (!this.shadowRoot) return;
        this.removeAllListeners();

        const theme = this.getAttribute('theme') || 'light';
        const layout = this.getAttribute('layout') || 'grid';
        const isDark = theme === 'dark';

        const styles = \`
          :host {
            display: block;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
          }
          .container {
            padding: 24px;
            background-color: \${isDark ? '#1a1a1a' : '#ffffff'};
            color: \${isDark ? '#ffffff' : '#333333'};
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            max-width: 100%;
            margin: 20px auto;
            border-radius: 12px;
          }
          h2, h3 { text-align: center; margin: 0 0 24px 0; font-weight: 600; }
          h2 { font-size: 24px; }
          h3 { font-size: 20px; margin-bottom: 20px; }
          .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
          .list { display: flex; flex-direction: column; gap: 16px; }
          .card { border: 1px solid \${isDark ? '#333' : '#eee'}; padding: 20px; border-radius: 12px; background-color: \${isDark ? '#2d2d2d' : '#f8f9fa'}; transition: transform 0.2s ease; cursor: pointer; }
          .card:hover { transform: translateY(-4px); }
          .card p { font-style: italic; font-size: 16px; line-height: 1.6; margin-bottom: 16px; }
          .footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; }
          .rating { color: #f59e0b; font-size: 18px; }
          .form-section { margin-top: 40px; padding-top: 20px; border-top: 1px solid \${isDark ? '#333' : '#eee'}; }
          form { display: flex; flex-direction: column; gap: 15px; max-width: 500px; margin: 0 auto; }
          input, textarea, select { width: 100%; padding: 12px; border-radius: 8px; border: 1px solid \${isDark ? '#444' : '#ccc'}; background-color: \${isDark ? '#2d2d2d' : '#fff'}; color: \${isDark ? '#fff' : '#333'}; font-family: inherit; box-sizing: border-box; }
          button { padding: 12px 24px; background-color: #3b82f6; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
          .success-msg { color: #10b981; text-align: center; margin-top: 10px; font-weight: 500; }
          .error-msg { color: #ef4444; text-align: center; margin-top: 10px; }
          .tags-container { font-family: inherit; margin: 16px 0; }
          .tags-group { display: flex; flex-wrap: wrap; gap: 10px; }
          .tag-label { display: flex; align-items: center; cursor: pointer; background-color: #f3f4f6; padding: 6px 12px; border-radius: 20px; font-size: 13px; color: #4b5563; border: 1px solid #e5e7eb; transition: all 0.2s ease; }
          .tag-label:has(input:checked) { background-color: #dbeafe; border-color: #3b82f6; color: #1e40af; }
        \`;

        let content = '';
        if (this._loading) {
          content = '<div style="text-align:center;padding:40px;color:#888;">Cargando testimonios...</div>';
        } else if (this._error) {
          content = \`<div style="color:#ef4444;text-align:center;padding:20px;">Error: \${this._error}</div>\`;
        } else {
          const watermarkHtml = \`
            <div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:12px;margin-bottom:12px;border-bottom:1px solid \${isDark ? '#333' : '#e5e7eb'};">
              <span style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;background:\${isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)'};border:1px solid \${isDark ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.2)'};border-radius:100px;font-size:11px;font-weight:600;color:#6366f1;text-transform:uppercase;"> ✨ Generado con AI </span>
              <div style="display:flex;align-items:center;gap:6px;opacity:0.5;">
                <svg width="18" height="18" viewBox="0 0 512 512" fill="none"><rect x="64" y="80" width="384" height="160" rx="80" fill="#18181B"/><rect x="176" y="208" width="160" height="256" rx="80" fill="#18181B"/><circle cx="416" cy="112" r="80" fill="#18181B"/><circle cx="416" cy="112" r="48" fill="#2563eb"/></svg>
                <span style="font-size:12px;font-weight:600;color:\${isDark ? '#94a3b8' : '#64748b'};">Testimo</span>
              </div>
            </div>\`;
          
          const summaryBox = this._aiSummary ? \`<div style="padding:16px 18px;background:\${isDark ? '#23272f' : '#f1f5f9'};border-radius:10px;margin-bottom:24px;font-size:15px;line-height:1.6;">\${watermarkHtml}\${this._aiSummary}</div>\` : '';
          
          const items = this._data.map(t => {
            const stars = '★'.repeat(t.rating || 5) + '☆'.repeat(5 - (t.rating || 5));
            const image = t.imageUrl ? \`<div style="margin-bottom:10px;"><img src="\${t.imageUrl}" style="max-width:120px;max-height:120px;border-radius:8px;border:1px solid #eee;" /></div>\` : '';
            return \`
              <div class="card" data-tid="\${t.id}">
                \${image}
                <p>"\${t.content}"</p>
                <div class="footer"><strong>\${t.author}</strong><div class="rating">\${stars}</div></div>
              </div>\`;
          }).join('');
          content = \`\${summaryBox}<div class="\${layout}" id="testimo-list">\${items}</div>\`;
        }

        const tagsComponent = \`
          <div class="tags-container">
            <span style="display:block;font-size:14px;font-weight:600;margin-bottom:10px;">Etiquetas:</span>
            <div class="tags-group">
              <label class="tag-label"><input type="checkbox" name="tags" value="PRODUCT" style="margin-right:8px;"/> Producto</label>
              <label class="tag-label"><input type="checkbox" name="tags" value="SERVICE" style="margin-right:8px;"/> Servicio</label>
              <label class="tag-label"><input type="checkbox" name="tags" value="SUPPORT" style="margin-right:8px;"/> Soporte</label>
            </div>
          </div>\`;

        this.shadowRoot.innerHTML = \`
          <style>\${styles}</style>
          <div class="container">
            <h2>What People Say</h2>
            \${content}
            <div class="form-section">
              <h3>Comparte tu experiencia</h3>
              <form id="testimonial-form">
                <input type="text" name="author" placeholder="Tu nombre" required />
                <select name="rating" required>
                  <option value="">Calificación</option>
                  <option value="5">★★★★★ Excelente</option>
                  <option value="4">★★★★☆ Buena</option>
                  <option value="3">★★★☆☆ Regular</option>
                </select>
                <textarea name="content" placeholder="Tu testimonio" required></textarea>
                <label style="font-size:14px;">Imagen (opcional): <input type="file" name="image" accept="image/*" style="border:none;padding:0;"/></label>
                \${tagsComponent}
                <button type="submit">Enviar testimonio</button>
              </form>
              <div id="form-feedback"></div>
            </div>
          </div>\`;

        const form = this.shadowRoot.getElementById('testimonial-form');
        if (form) {
          this.formListener = this._handleSubmit;
          form.addEventListener('submit', this.formListener);
        }

        const list = this.shadowRoot.getElementById('testimo-list');
        if (list) {
          list.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', () => {
              const tid = card.getAttribute('data-tid');
              if (tid) this.trackClick(tid);
            });
          });
        }
      }
    }
    customElements.define('testimo-widget', TestimoWidget);
  }
})();`;
    return res.send(scriptContent);
  }

  @Public()
  @Get('sdk.js')
  getSdk(@Res() res: Response) {
    const filePath = join(process.cwd(), '../sdk/dist/sdk.js');
    res.sendFile(filePath);
  }
}