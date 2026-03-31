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
    const { organizationId, author, content, rating, videoUrl } =
      req.body || {};

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

    const testimonials =
      await this.testimonialRepository.findApprovedByOrganization(
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
    const tick = '`';
    const dollar = '$';

    const scriptContent = `
var y = Object.defineProperty;
var v = (s, r, d) => r in s ? y(s, r, { enumerable: !0, configurable: !0, writable: !0, value: d }) : s[r] = d;
var o = (s, r, d) => (v(s, typeof r != "symbol" ? r + "" : r, d), d);
if (typeof window < "u" && !customElements.get("testimo-widget")) {
  class s extends HTMLElement {
    constructor() {
      super();
      o(this, "_data", []);
      o(this, "_aiSummary", "");
      o(this, "_loading", !0);
      o(this, "_error", null);
      o(this, "_submitting", !1);
      o(this, "formListener", null);
      o(this, "clickListeners", []);
      o(this, "_handleSubmit", async (e) => {
        var g;
        e.preventDefault();
        const i = e.target, t = new FormData(i), p = this.getAttribute("organization-id"), a = (g = this.shadowRoot) == null ? void 0 : g.getElementById("form-feedback");
        if (this._submitting || !p) return;
        this._submitting = !0;
        const l = i.querySelector("button");
        l && (l.disabled = !0, l.textContent = "Enviando...");
        try {
          t.append("organizationId", p);
          const resp = await fetch(${tick}${dollar}{this.apiUrl}/widget/submit${tick}, {
            method: "POST",
            body: t
          });
          if (!resp.ok) throw new Error("Failed to submit");
          i.reset();
          if (a) {
            a.textContent = "¡Gracias! Tu testimonio ha sido enviado para revisión.";
            a.className = "success-msg";
          }
        } catch {
          if (a) {
            a.textContent = "Error al enviar el testimonio. Inténtalo de nuevo.";
            a.className = "error-msg";
          }
        } finally {
          this._submitting = !1;
          if (l) { l.disabled = !1; l.textContent = "Enviar testimonio"; }
        }
      });
      this.attachShadow({ mode: "open" });
    }
    static get observedAttributes() {
      return ["organization-id", "theme", "layout", "api-url"];
    }
    connectedCallback() {
      this.fetchData();
      this.trackView();
    }
    disconnectedCallback() {
      this.removeAllListeners();
    }
    removeAllListeners() {
      var e, i;
      if (this.formListener) {
        i = (e = this.shadowRoot) == null ? void 0 : e.getElementById("testimonial-form");
        if (i) i.removeEventListener("submit", this.formListener);
        this.formListener = null;
      }
      this.clickListeners.forEach((t) => t());
      this.clickListeners = [];
    }
    get apiUrl() {
      return this.getAttribute("api-url") || "http://hackathoncubepath-server-zzxmva-37677b-108-165-47-237.traefik.me";
    }
    attributeChangedCallback(e, i, t) {
      if (i !== t) {
        if (e === "organization-id" || e === "api-url") this.fetchData();
        else this.render();
      }
    }
    async trackView() {
      const e = this.getAttribute("organization-id");
      if (e) {
        try {
          await fetch(${tick}${dollar}{this.apiUrl}/analytics/track${tick}, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              organizationId: e,
              testimonialId: "all",
              type: "view",
              metadata: { widget: !0 }
            })
          });
        } catch {}
      }
    }
    async fetchData() {
      const e = this.getAttribute("organization-id");
      if (!e) {
        this._error = "Organization ID is missing";
        this._loading = !1;
        this.render();
        return;
      }
      this._loading = !0;
      this._error = null;
      this.render();
      try {
        const i = await fetch(${tick}${dollar}{this.apiUrl}/widget/data?organizationId=${dollar}{e}${tick});
        if (!i.ok) throw new Error("Failed to fetch testimonials");
        this._data = await i.json();
        if (this._data.length > 0) {
          if (this._data.length === 1) this._aiSummary = ${tick}Las personas comentan que: "${dollar}{this._data[0].content}"${tick};
          else if (this._data.length === 2) this._aiSummary = ${tick}Las personas comentan que: "${dollar}{this._data[0].content}" y "${dollar}{this._data[1].content}"${tick};
          else this._aiSummary = ${tick}Las personas comentan que: "${dollar}{this._data[0].content}", "${dollar}{this._data[1].content}" y otros ${dollar}{this._data.length - 2} testimonios más.${tick};
        } else {
          this._aiSummary = "Aún no hay testimonios para analizar.";
        }
      } catch (i) {
        this._error = i.message || "Failed to load testimonials";
      } finally {
        this._loading = !1;
        this.render();
      }
    }
    render() {
      if (!this.shadowRoot) return;
      this.removeAllListeners();
      const e = this.getAttribute("theme") || "light", i = this.getAttribute("layout") || "grid", t = e === "dark";
      const p = ${tick}
        :host { display: block; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .container { padding: 24px; background-color: ${dollar}{t ? "#1a1a1a" : "#ffffff"}; color: ${dollar}{t ? "#ffffff" : "#333333"}; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 12px; max-width: 100%; margin: 20px auto; }
        h2, h3 { text-align: center; margin: 0 0 24px 0; font-weight: 600; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        .list { display: flex; flex-direction: column; gap: 16px; }
        .card { border: 1px solid ${dollar}{t ? "#333" : "#eee"}; padding: 20px; border-radius: 12px; background-color: ${dollar}{t ? "#2d2d2d" : "#f8f9fa"}; transition: transform 0.2s ease; cursor: pointer; }
        .card:hover { transform: translateY(-4px); }
        .card p { font-style: italic; font-size: 16px; line-height: 1.6; margin-bottom: 16px; }
        .footer { display: flex; align-items: center; justify-content: space-between; }
        .rating { color: #f59e0b; font-size: 18px; }
        .form-section { margin-top: 40px; padding-top: 20px; border-top: 1px solid ${dollar}{t ? "#333" : "#eee"}; }
        form { display: flex; flex-direction: column; gap: 15px; max-width: 500px; margin: 0 auto; }
        input, textarea, select { width: 100%; padding: 12px; border-radius: 8px; border: 1px solid ${dollar}{t ? "#444" : "#ccc"}; background-color: ${dollar}{t ? "#2d2d2d" : "#fff"}; color: ${dollar}{t ? "#fff" : "#333"}; font-family: inherit; box-sizing: border-box; }
        button { padding: 12px 24px; background-color: #3b82f6; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
        button:disabled { background-color: #93c5fd; }
        .success-msg { color: #10b981; text-align: center; margin-top: 10px; font-weight: 500; }
        .error-msg { color: #ef4444; text-align: center; margin-top: 10px; }
        .tag-label { display: flex; align-items: center; cursor: pointer; background-color: #f3f4f6; padding: 6px 12px; border-radius: 20px; font-size: 13px; color: #4b5563; border: 1px solid #e5e7eb; transition: all 0.2s ease; }
        .tag-label:has(input:checked) { background-color: #dbeafe; border-color: #3b82f6; color: #1e40af; }
      ${tick};
      let a = "";
      if (this._loading) a = '<div style="text-align:center;padding:40px;color:#888;">Cargando testimonios...</div>';
      else if (this._error) a = ${tick}<div style="color:#ef4444;text-align:center;padding:20px;">Error: ${dollar}{this._error}</div>${tick};
      else {
        const c = ${tick}
          <div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:12px;margin-bottom:12px;border-bottom:1px solid ${dollar}{t ? "#333" : "#e5e7eb"};">
            <span style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;background:${dollar}{t ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.1)"};border:1px solid ${dollar}{t ? "rgba(99,102,241,0.3)" : "rgba(99,102,241,0.2)"};border-radius:100px;font-size:11px;font-weight:600;color:#6366f1;text-transform:uppercase;"> ✨ Generado con AI </span>
            <div style="display:flex;align-items:center;gap:6px;opacity:0.5;">
              <svg width="18" height="18" viewBox="0 0 512 512" fill="none"><defs><linearGradient id="notif_grad_sdk" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#2563eb"/></linearGradient><mask id="cutout-mask-sdk"><rect width="100%" height="100%" fill="white"/><circle cx="416" cy="112" r="80" fill="black"/></mask></defs><rect x="64" y="80" width="384" height="160" rx="80" fill="#18181B"/><rect x="176" y="208" width="160" height="256" rx="80" fill="#18181B"/><circle cx="416" cy="112" r="80" fill="#18181B"/><rect x="96" y="112" width="320" height="96" rx="48" fill="white" mask="url(#cutout-mask-sdk)"/><rect x="208" y="240" width="96" height="192" rx="48" fill="white"/><circle cx="416" cy="112" r="48" fill="url(#notif_grad_sdk)"/></svg>
              <span style="font-size:12px;font-weight:600;color:${dollar}{t ? "#94a3b8" : "#64748b"};">Testimo</span>
            </div>
          </div>
        ${tick};
        const h = this._aiSummary ? ${tick}<div style="padding:16px 18px;background:${dollar}{t ? "#23272f" : "#f1f5f9"};border-radius:10px;margin-bottom:24px;font-size:15px;line-height:1.6;">${dollar}{c}${dollar}{this._aiSummary}</div>${tick} : "";
        const f = this._data.map((n) => {
          const b = n.rating ? "★".repeat(n.rating) + "☆".repeat(5 - n.rating) : "";
          const x = n.imageUrl ? ${tick}<div style="margin-bottom:10px;"><img src="${dollar}{n.imageUrl}" style="max-width:120px;border-radius:8px;border:1px solid #eee;" /></div>${tick} : "";
          return ${tick}<div class="card" data-tid="${dollar}{n.id}">${dollar}{x}<p>"${dollar}{n.content}"</p><div class="footer"><strong>${dollar}{n.author}</strong><div class="rating">${dollar}{b}</div></div></div>${tick};
        }).join("");
        a = ${tick}${dollar}{h}<div class="${dollar}{i}" id="testimo-list">${dollar}{f}</div>${tick};
      }
      this.shadowRoot.innerHTML = ${tick}
        <style>${dollar}{p}</style>
        <div class="container">
          <h2>What People Say</h2>
          ${dollar}{a}
          <div class="form-section">
            <h3>Comparte tu experiencia</h3>
            <form id="testimonial-form" enctype="multipart/form-data">
              <input type="text" name="author" placeholder="Tu nombre" required />
              <select name="rating" required>
                <option value="">Calificación</option>
                <option value="5">★★★★★ Excelente</option><option value="4">★★★★☆ Buena</option>
                <option value="3">★★★☆☆ Regular</option><option value="2">★★☆☆☆ Mala</option><option value="1">★☆☆☆☆ Terrible</option>
              </select>
              <textarea name="content" placeholder="Tu testimonio" required></textarea>
              <label style="font-size:14px;">Imagen (opcional): <input type="file" name="image" accept="image/*" style="border:none;padding:0;"/></label>
              <input type="text" name="videoUrl" placeholder="URL de video (opcional)" />
              <div style="margin-top:10px;"><span style="font-size:14px;font-weight:600;">Etiquetas:</span>
                <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:8px;">
                  <label class="tag-label"><input type="checkbox" name="tags" value="PRODUCT" style="margin-right:5px;"/> Producto</label>
                  <label class="tag-label"><input type="checkbox" name="tags" value="SERVICE" style="margin-right:5px;"/> Servicio</label>
                  <label class="tag-label"><input type="checkbox" name="tags" value="SUPPORT" style="margin-right:5px;"/> Soporte</label>
                  <label class="tag-label"><input type="checkbox" name="tags" value="GENERAL" style="margin-right:5px;"/> General</label>
                </div>
              </div>
              <button type="submit">Enviar testimonio</button>
            </form>
            <div id="form-feedback"></div>
          </div>
        </div>
      ${tick};
      const m = this.shadowRoot.getElementById("testimonial-form");
      m && (this.formListener = this._handleSubmit, m.addEventListener("submit", this.formListener));
      const u = this.shadowRoot.getElementById("testimo-list");
      if (u) {
        u.querySelectorAll(".card").forEach((c) => {
          c.addEventListener("click", () => {
            const fid = c.getAttribute("data-tid");
            if (fid) this.trackClick(fid);
          });
        });
      }
    }
    async trackClick(e) {
      const i = this.getAttribute("organization-id");
      if (i && e) {
        fetch(${tick}${dollar}{this.apiUrl}/analytics/track${tick}, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ organizationId: i, testimonialId: e, type: "click", metadata: { widget: true } })
        }).catch(() => {});
      }
    }
  }
  customElements.define("testimo-widget", s);
}
    `;

    return res.send(scriptContent);
  }

  @Public()
  @Get('sdk.js')
  getSdk(@Res() res: Response) {
    const filePath = join(process.cwd(), '../sdk/dist/sdk.js');
    res.sendFile(filePath);
  }
}
