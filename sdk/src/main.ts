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

    // Referencias a elementos que necesitamos manipular
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
      // Limpieza de listeners al remover el componente
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

    get apiUrl() {
      return this.getAttribute('api-url') || 'http://cubepathhackaton-api-aymrvj-31e30c-108-165-47-144.traefik.me';
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
        // Fetch testimonials
        const response = await fetch(`${this.apiUrl}/widget/data?organizationId=${orgId}`);
        if (!response.ok) throw new Error('Failed to fetch testimonials');
        this._data = await response.json();

        // IA summary mock (igual que embed.js)
        let summary = '';
        if (this._data.length > 0) {
          if (this._data.length === 1) {
            summary = `Las personas comentan que: "${this._data[0].content}"`;
          } else if (this._data.length === 2) {
            summary = `Las personas comentan que: "${this._data[0].content}" y "${this._data[1].content}"`;
          } else {
            summary = `Las personas comentan que: "${this._data[0].content}", "${this._data[1].content}" y otros ${this._data.length - 2} testimonios más.`;
          }
        } else {
          summary = 'Aún no hay testimonios para analizar.';
        }
        this._aiSummary = summary;
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
      const data = Object.fromEntries(formData.entries());
      const orgId = this.getAttribute('organization-id');
      const feedback = this.shadowRoot?.getElementById('form-feedback') as HTMLDivElement;

      if (this._submitting || !orgId) return;

      this._submitting = true;
      const btn = form.querySelector('button') as HTMLButtonElement;
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Submitting...';
      }

      try {
        const response = await fetch(`${this.apiUrl}/widget/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, organizationId: orgId }),
        });

        if (!response.ok) throw new Error('Failed to submit');

        form.reset();
        if (feedback) {
          feedback.textContent = 'Thank you! Your testimonial has been submitted for review.';
          feedback.className = 'success-msg';
        }
      } catch (err) {
        if (feedback) {
          feedback.textContent = 'Error submitting testimonial. Please try again.';
          feedback.className = 'error-msg';
        }
      } finally {
        this._submitting = false;
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Submit Testimonial';
        }
      }
    };

    render() {
      if (!this.shadowRoot) return;

      // Limpiar listeners anteriores antes de re-renderizar
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
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 100%;
          margin: 20px auto;
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
          gap: 20px;
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
        .error {
          color: #ef4444;
          text-align: center;
          padding: 20px;
        }
        .loading {
          text-align: center;
          padding: 20px;
          color: #888;
        }
        
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
          transition: background-color 0.2s;
        }
        button:hover:not(:disabled) { background-color: #2563eb; }
        button:disabled { background-color: #93c5fd; cursor: not-allowed; }
        .success-msg { color: #10b981; text-align: center; margin-top: 10px; font-weight: 500; }
        .error-msg { color: #ef4444; text-align: center; margin-top: 10px; }
      `;

      let content = '';

      if (this._loading) {
        content = '<div class="loading">Loading testimonials...</div>';
      } else if (this._error) {
        content = `<div class="error">Error: ${this._error}</div>`;
      } else {
        const summaryBox = this._aiSummary
          ? `<div style="padding:18px 20px;background:${isDark ? '#23272f' : '#f1f5f9'};border-radius:10px;margin-bottom:28px;font-size:16px;font-style:italic;color:${isDark ? '#cbd5e1' : '#334155'};">${this._aiSummary}</div>`
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

      const formHtml = `
        <div class="form-section">
          <h3>Share your experience</h3>
          <form id="testimonial-form">
            <input type="text" name="author" placeholder="Your Name" required />
            <select name="rating">
              <option value="5">★★★★★ Excellent</option>
              <option value="4">★★★★☆ Good</option>
              <option value="3">★★★☆☆ Average</option>
              <option value="2">★★☆☆☆ Poor</option>
              <option value="1">★☆☆☆☆ Terrible</option>
            </select>
            <textarea name="content" placeholder="Your Testimonial" required></textarea>
            <button type="submit">Submit Testimonial</button>
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

      // Agregar listener del formulario (solo una vez por render)
      const form = this.shadowRoot.getElementById('testimonial-form') as HTMLFormElement;
      if (form) {
        this.formListener = this._handleSubmit;
        form.addEventListener('submit', this.formListener);
      }

      // Agregar listeners de clic en tarjetas
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