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
            body: JSON.stringify({ organizationId: orgId, type: 'view' })
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
        this.render();
        try {
          const response = await fetch(\`\${this.apiUrl}/widget/data?organizationId=\${orgId}\`);
          this._data = await response.json();
          this._aiSummary = this._data.length > 0 ? \`Resumen de \${this._data.length} testimonios cargados.\` : 'Sin testimonios.';
        } catch (err) {
          this._error = 'Error al cargar';
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
        if (this._submitting || !orgId) return;

        this._submitting = true;
        this.render();

        try {
          formData.append('organizationId', orgId);
          await fetch(\`\${this.apiUrl}/widget/submit\`, { method: 'POST', body: formData });
          form.reset();
          alert('¡Gracias por tu testimonio!');
          this.fetchData();
        } catch (err) {
          alert('Error al enviar');
        } finally {
          this._submitting = false;
          this.render();
        }
      }

      render() {
        if (!this.shadowRoot) return;
        this.removeAllListeners();
        const isDark = this.getAttribute('theme') === 'dark';
        
        const styles = \`
          :host { display: block; font-family: sans-serif; }
          .container { padding: 20px; border-radius: 8px; background: \${isDark ? '#333' : '#fff'}; color: \${isDark ? '#fff' : '#000'}; border: 1px solid #ccc; }
          .card { border-bottom: 1px solid #eee; padding: 10px 0; }
          form { margin-top: 20px; display: flex; flex-direction: column; gap: 8px; }
          input, textarea { width: 100%; box-sizing: border-box; }
        \`;

        const items = this._data.map(t => \`
          <div class="card">
            <p>"\${t.content}"</p>
            <small>- \${t.author} (\${'★'.repeat(t.rating)})</small>
          </div>
        \`).join('');

        this.shadowRoot.innerHTML = \`
          <style>\${styles}</style>
          <div class="container">
            <h3>Testimonios</h3>
            <p><i>\${this._aiSummary}</i></p>
            <div>\${this._loading ? 'Cargando...' : items}</div>
            <form id="testimonial-form">
              <input name="author" placeholder="Tu nombre" required />
              <input type="number" name="rating" min="1" max="5" value="5" required />
              <textarea name="content" placeholder="Tu mensaje" required></textarea>
              <button type="submit" \${this._submitting ? 'disabled' : ''}>
                \${this._submitting ? 'Enviando...' : 'Enviar Testimonio'}
              </button>
            </form>
          </div>
        \`;

        const form = this.shadowRoot.getElementById('testimonial-form');
        if (form) {
          this.formListener = this._handleSubmit;
          form.addEventListener('submit', this.formListener);
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