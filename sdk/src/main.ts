// src/main.ts
if (typeof window !== 'undefined' && !customElements.get('testimo-widget')) {
  class TestimoWidget extends HTMLElement {
    static get observedAttributes() {
      return ['organization-id', 'theme', 'layout', 'api-url'];
    }

    private _data: any[] = [];
    private _aiSummary: string = '';
    private _loading: boolean = true;
    private _error: string | null = null;
    private _submitting: boolean = false;

    private formListener: ((e: Event) => void) | null = null;
    private clickListeners: (() => void)[] = [];

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
      this.fetchData();
      this.trackView();
    }

    disconnectedCallback() {
      this.removeAllListeners();
    }

    private removeAllListeners() {
      if (this.formListener) {
        this.shadowRoot?.getElementById('testimonial-form')?.removeEventListener('submit', this.formListener);
        this.formListener = null;
      }

      this.clickListeners.forEach(unlisten => unlisten());
      this.clickListeners = [];
    }

    get apiUrl() {
      return this.getAttribute('api-url') || 'http://hackathoncubepath-server-zzxmva-37677b-108-165-47-237.traefik.me';
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
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
        await fetch(`${this.apiUrl}/analytics/track`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            organizationId: orgId,
            testimonialId: 'all',
            type: 'view',
            metadata: { widget: true }
          })
        });
      } catch (e) {
        // Silencioso
      }
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
        const response = await fetch(`${this.apiUrl}/widget/data?organizationId=${orgId}`);
        if (!response.ok) throw new Error('Failed to fetch testimonials');

        this._data = await response.json();

        // Generar resumen IA simple
        if (this._data.length > 0) {
          if (this._data.length === 1) {
            this._aiSummary = `Las personas comentan que: "${this._data[0].content}"`;
          } else if (this._data.length === 2) {
            this._aiSummary = `Las personas comentan que: "${this._data[0].content}" y "${this._data[1].content}"`;
          } else {
            this._aiSummary = `Las personas comentan que: "${this._data[0].content}", "${this._data[1].content}" y otros ${this._data.length - 2} testimonios más.`;
          }
        } else {
          this._aiSummary = 'Aún no hay testimonios para analizar.';
        }
      } catch (err: any) {
        this._error = err.message || 'Failed to load testimonials';
      } finally {
        this._loading = false;
        this.render();
      }
    }

    private _handleSubmit = async (e: Event) => {
      e.preventDefault();

      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const orgId = this.getAttribute('organization-id');
      const feedback = this.shadowRoot?.getElementById('form-feedback') as HTMLDivElement;

      if (this._submitting || !orgId) return;

      this._submitting = true;
      const btn = form.querySelector('button') as HTMLButtonElement;
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Enviando...';
      }

      try {
        formData.append('organizationId', orgId);

        const response = await fetch(`${this.apiUrl}/widget/submit`, {
          method: 'POST',
          body: formData,                    // Usamos FormData porque hay archivo
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

    render() {
      if (!this.shadowRoot) return;

      this.removeAllListeners();

      const theme = this.getAttribute('theme') || 'light';
      const layout = this.getAttribute('layout') || 'grid';
      const isDark = theme === 'dark';

      const styles = `
        :host {
          display: block;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        }
        .container {
          padding: 24px;
          background-color: ${isDark ? '#1a1a1a' : '#ffffff'};
          color: ${isDark ? '#ffffff' : '#333333'};
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 100%;
          margin: 20px auto;
          border-radius: 12px;
        }
        h2, h3 {
          text-align: center;
          margin: 0 0 24px 0;
          font-weight: 600;
        }
        h2 { font-size: 24px; }
        h3 { font-size: 20px; margin-bottom: 20px; }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .card {
          border: 1px solid ${isDark ? '#333' : '#eee'};
          padding: 20px;
          border-radius: 12px;
          background-color: ${isDark ? '#2d2d2d' : '#f8f9fa'};
          transition: transform 0.2s ease;
          cursor: pointer;
        }
        .card:hover {
          transform: translateY(-4px);
        }
        .card p {
          font-style: italic;
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 16px;
        }
        .footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
        }
        .rating {
          color: #f59e0b;
          font-size: 18px;
        }

        .error { color: #ef4444; text-align: center; padding: 20px; }
        .loading { text-align: center; padding: 40px; color: #888; }

        /* Form Styles */
        .form-section {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid ${isDark ? '#333' : '#eee'};
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 15px;
          max-width: 500px;
          margin: 0 auto;
        }
        input, textarea, select {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid ${isDark ? '#444' : '#ccc'};
          background-color: ${isDark ? '#2d2d2d' : '#fff'};
          color: ${isDark ? '#fff' : '#333'};
          font-family: inherit;
          box-sizing: border-box;
        }
        textarea { resize: vertical; min-height: 80px; }
        button {
          padding: 12px 24px;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }
        button:hover:not(:disabled) { background-color: #2563eb; }
        button:disabled { background-color: #93c5fd; cursor: not-allowed; }

        .success-msg { color: #10b981; text-align: center; margin-top: 10px; font-weight: 500; }
        .error-msg { color: #ef4444; text-align: center; margin-top: 10px; }
      `;

      let content = '';

      if (this._loading) {
        content = '<div class="loading">Cargando testimonios...</div>';
      } else if (this._error) {
        content = `<div class="error">Error: ${this._error}</div>`;
      } else {
        const watermarkHtml = `
          <div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:12px;margin-bottom:12px;border-bottom:1px solid ${isDark ? '#333' : '#e5e7eb'};">
            <div style="display:flex;align-items:center;">
              <span style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;background:${isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)'};border:1px solid ${isDark ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.2)'};border-radius:100px;font-size:11px;font-weight:600;color:#6366f1;text-transform:uppercase;letter-spacing:0.03em;">
                ✨ Generado con AI
              </span>
            </div>
            <div style="display:flex;align-items:center;gap:6px;opacity:0.5;">
              <svg width="18" height="18" viewBox="0 0 512 512" fill="none">
                <defs>
                  <linearGradient id="notif_grad_sdk" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#38bdf8"/>
                    <stop offset="100%" stop-color="#2563eb"/> 
                  </linearGradient>
                  <mask id="cutout-mask-sdk">
                    <rect width="100%" height="100%" fill="white"/>
                    <circle cx="416" cy="112" r="80" fill="black"/>
                  </mask>
                </defs>
                <rect x="64" y="80" width="384" height="160" rx="80" fill="#18181B"/>
                <rect x="176" y="208" width="160" height="256" rx="80" fill="#18181B"/>
                <circle cx="416" cy="112" r="80" fill="#18181B"/>
                <rect x="96" y="112" width="320" height="96" rx="48" fill="white" mask="url(#cutout-mask-sdk)"/>
                <rect x="208" y="240" width="96" height="192" rx="48" fill="white"/>
                <circle cx="416" cy="112" r="48" fill="url(#notif_grad_sdk)"/>
              </svg>
              <span style="font-size:12px;font-weight:600;color:${isDark ? '#94a3b8' : '#64748b'};">Testimo</span>
            </div>
          </div>
        `;
        
        const summaryBox = this._aiSummary
          ? `<div style="padding:16px 18px;background:${isDark ? '#23272f' : '#f1f5f9'};border-radius:10px;margin-bottom:24px;font-size:15px;color:${isDark ? '#cbd5e1' : '#334155'};line-height:1.6;">${watermarkHtml}${this._aiSummary}</div>`
          : '';

        const items = this._data.map(t => {
          const stars = t.rating ? '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating) : '';
          const image = t.imageUrl 
            ? `<div style="margin-bottom:10px;"><img src="${t.imageUrl}" alt="Testimonial" style="max-width:120px;max-height:120px;border-radius:8px;border:1px solid #eee;" /></div>` 
            : '';

          return `
            <div class="card" data-tid="${t.id}">
              ${image}
              <p>"${t.content}"</p>
              <div class="footer">
                <strong>${t.author}</strong>
                <div class="rating">${stars}</div>
              </div>
            </div>
          `;
        }).join('');

        content = `${summaryBox}<div class="${layout}" id="testimo-list">${items}</div>`;
      }

      const tagsComponent = `
<style>
  .tags-container {
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    margin: 16px 0;
    max-width: 100%;
  }

  .tags-title {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 10px;
  }

  .tags-group {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .tag-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    background-color: #f3f4f6;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 13px;
    color: #4b5563;
    border: 1px solid #e5e7eb;
    transition: all 0.2s ease;
    user-select: none;
  }

  .tag-label:hover {
    background-color: #e5e7eb;
    border-color: #d1d5db;
  }

  .tag-label input[type="checkbox"] {
    margin-right: 8px;
    width: 16px;
    height: 16px;
    accent-color: #2563eb; /* Color azul moderno para el check */
    cursor: pointer;
  }

  /* Estado cuando el checkbox está marcado */
  .tag-label:has(input:checked) {
    background-color: #dbeafe;
    border-color: #3b82f6;
    color: #1e40af;
  }
</style>

<div class="tags-container">
  <span class="tags-title">Etiquetas:</span>
  <div class="tags-group">
    <label class="tag-label">
      <input type="checkbox" name="tags" value="PRODUCT" /> Producto
    </label>
    <label class="tag-label">
      <input type="checkbox" name="tags" value="SERVICE" /> Servicio
    </label>
    <label class="tag-label">
      <input type="checkbox" name="tags" value="SUPPORT" /> Soporte
    </label>
    <label class="tag-label">
      <input type="checkbox" name="tags" value="GENERAL" /> General
    </label>
  </div>
</div>
`;

      const formHtml = `
        <div class="form-section">
          <h3>Comparte tu experiencia</h3>
          <form id="testimonial-form" enctype="multipart/form-data">
            <input type="text" name="author" placeholder="Tu nombre" required />
            <select name="rating" required>
              <option value="">Calificación</option>
              <option value="5">★★★★★ Excelente</option>
              <option value="4">★★★★☆ Buena</option>
              <option value="3">★★★☆☆ Regular</option>
              <option value="2">★★☆☆☆ Mala</option>
              <option value="1">★☆☆☆☆ Terrible</option>
            </select>
            <textarea name="content" placeholder="Tu testimonio" required></textarea>
            <label>Imagen (opcional): <input type="file" name="image" accept="image/*" /></label>
            <input type="text" name="videoUrl" placeholder="URL de video (opcional)" />
            
            <div style="margin:8px 0 0 0;">
              <span style="font-size:14px;">Etiquetas:</span><br/>
              ${tagsComponent}
            </div>
            <button type="submit">Enviar testimonio</button>
          </form>
          <div id="form-feedback"></div>
        </div>
      `;

      this.shadowRoot.innerHTML = `
        <style>${styles}</style>
        <div class="container">
          <h2>What People Say</h2>
          ${content}
          ${formHtml}
        </div>
      `;

      // Agregar listener del formulario
      const form = this.shadowRoot.getElementById('testimonial-form') as HTMLFormElement;
      if (form) {
        this.formListener = this._handleSubmit;
        form.addEventListener('submit', this.formListener);
      }

      // Agregar listeners de clic en las tarjetas
      const list = this.shadowRoot.getElementById('testimo-list');
      if (list) {
        this.clickListeners = [];
        list.querySelectorAll('.card').forEach(card => {
          const handler = () => {
            const tid = card.getAttribute('data-tid');
            if (tid) this.trackClick(tid);
          };
          card.addEventListener('click', handler);
          this.clickListeners.push(() => card.removeEventListener('click', handler));
        });
      }
    }

    async trackClick(testimonialId: string) {
      const orgId = this.getAttribute('organization-id');
      if (!orgId || !testimonialId) return;

      try {
        await fetch(`${this.apiUrl}/analytics/track`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            organizationId: orgId,
            testimonialId,
            type: 'click',
            metadata: { widget: true }
          })
        });
      } catch (e) {
        // Silencioso
      }
    }
  }

  customElements.define('testimo-widget', TestimoWidget);
}