var x = Object.defineProperty;
var y = (s, n, d) => n in s ? x(s, n, { enumerable: !0, configurable: !0, writable: !0, value: d }) : s[n] = d;
var r = (s, n, d) => (y(s, typeof n != "symbol" ? n + "" : n, d), d);
if (typeof window < "u" && !customElements.get("testimo-widget")) {
  class s extends HTMLElement {
    constructor() {
      super();
      r(this, "_data", []);
      r(this, "_aiSummary", "");
      r(this, "_loading", !0);
      r(this, "_error", null);
      r(this, "_submitting", !1);
      r(this, "formListener", null);
      r(this, "clickListeners", []);
      r(this, "_handleSubmit", async (t) => {
        var m;
        t.preventDefault();
        const e = t.target, i = new FormData(e), p = this.getAttribute("organization-id"), a = (m = this.shadowRoot) == null ? void 0 : m.getElementById("form-feedback");
        if (this._submitting || !p)
          return;
        this._submitting = !0;
        const l = e.querySelector("button");
        l && (l.disabled = !0, l.textContent = "Enviando...");
        try {
          if (i.append("organizationId", p), !(await fetch(`${this.apiUrl}/widget/submit`, {
            method: "POST",
            body: i
            // Usamos FormData porque hay archivo
          })).ok)
            throw new Error("Failed to submit");
          e.reset(), a && (a.textContent = "¡Gracias! Tu testimonio ha sido enviado para revisión.", a.className = "success-msg");
        } catch {
          a && (a.textContent = "Error al enviar el testimonio. Inténtalo de nuevo.", a.className = "error-msg");
        } finally {
          this._submitting = !1, l && (l.disabled = !1, l.textContent = "Enviar testimonio");
        }
      });
      this.attachShadow({ mode: "open" });
    }
    static get observedAttributes() {
      return ["organization-id", "theme", "layout", "api-url"];
    }
    connectedCallback() {
      this.fetchData(), this.trackView();
    }
    disconnectedCallback() {
      this.removeAllListeners();
    }
    removeAllListeners() {
      var t, e;
      this.formListener && ((e = (t = this.shadowRoot) == null ? void 0 : t.getElementById("testimonial-form")) == null || e.removeEventListener("submit", this.formListener), this.formListener = null), this.clickListeners.forEach((i) => i()), this.clickListeners = [];
    }
    get apiUrl() {
      return this.getAttribute("api-url") || "http://hackathoncubepath-server-zzxmva-37677b-108-165-47-237.traefik.me";
    }
    attributeChangedCallback(t, e, i) {
      e !== i && (t === "organization-id" || t === "api-url" ? this.fetchData() : this.render());
    }
    async trackView() {
      const t = this.getAttribute("organization-id");
      if (t)
        try {
          await fetch(`${this.apiUrl}/analytics/track`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              organizationId: t,
              testimonialId: "all",
              type: "view",
              metadata: { widget: !0 }
            })
          });
        } catch {
        }
    }
    async fetchData() {
      const t = this.getAttribute("organization-id");
      if (!t) {
        this._error = "Organization ID is missing", this._loading = !1, this.render();
        return;
      }
      this._loading = !0, this._error = null, this.render();
      try {
        const e = await fetch(`${this.apiUrl}/widget/data?organizationId=${t}`);
        if (!e.ok)
          throw new Error("Failed to fetch testimonials");
        this._data = await e.json(), this._data.length > 0 ? this._data.length === 1 ? this._aiSummary = `Las personas comentan que: "${this._data[0].content}"` : this._data.length === 2 ? this._aiSummary = `Las personas comentan que: "${this._data[0].content}" y "${this._data[1].content}"` : this._aiSummary = `Las personas comentan que: "${this._data[0].content}", "${this._data[1].content}" y otros ${this._data.length - 2} testimonios más.` : this._aiSummary = "Aún no hay testimonios para analizar.";
      } catch (e) {
        this._error = e.message || "Failed to load testimonials";
      } finally {
        this._loading = !1, this.render();
      }
    }
    render() {
      if (!this.shadowRoot)
        return;
      this.removeAllListeners();
      const t = this.getAttribute("theme") || "light", e = this.getAttribute("layout") || "grid", i = t === "dark", p = `
        :host {
          display: block;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        }
        .container {
          padding: 24px;
          background-color: ${i ? "#1a1a1a" : "#ffffff"};
          color: ${i ? "#ffffff" : "#333333"};
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
          border: 1px solid ${i ? "#333" : "#eee"};
          padding: 20px;
          border-radius: 12px;
          background-color: ${i ? "#2d2d2d" : "#f8f9fa"};
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
          border-top: 1px solid ${i ? "#333" : "#eee"};
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
          border: 1px solid ${i ? "#444" : "#ccc"};
          background-color: ${i ? "#2d2d2d" : "#fff"};
          color: ${i ? "#fff" : "#333"};
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
      let a = "";
      if (this._loading)
        a = '<div class="loading">Cargando testimonios...</div>';
      else if (this._error)
        a = `<div class="error">Error: ${this._error}</div>`;
      else {
        const c = this._aiSummary ? `<div style="padding:18px 20px;background:${i ? "#23272f" : "#f1f5f9"};border-radius:10px;margin-bottom:28px;font-size:16px;font-style:italic;color:${i ? "#cbd5e1" : "#334155"};">${this._aiSummary}</div>` : "", h = this._data.map((o) => {
          const f = o.rating ? "★".repeat(o.rating) + "☆".repeat(5 - o.rating) : "", b = o.imageUrl ? `<div style="margin-bottom:10px;"><img src="${o.imageUrl}" alt="Testimonial" style="max-width:120px;max-height:120px;border-radius:8px;border:1px solid #eee;" /></div>` : "";
          return `
            <div class="card" data-tid="${o.id}">
              ${b}
              <p>"${o.content}"</p>
              <div class="footer">
                <strong>${o.author}</strong>
                <div class="rating">${f}</div>
              </div>
            </div>
          `;
        }).join("");
        a = `${c}<div class="${e}" id="testimo-list">${h}</div>`;
      }
      const m = `
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

            </div>
            <button type="submit">Enviar testimonio</button>
          </form>
          <div id="form-feedback"></div>
        </div>
      `;
      this.shadowRoot.innerHTML = `
        <style>${p}</style>
        <div class="container">
          <h2>What People Say</h2>
          ${a}
          ${m}
        </div>
      `;
      const g = this.shadowRoot.getElementById("testimonial-form");
      g && (this.formListener = this._handleSubmit, g.addEventListener("submit", this.formListener));
      const u = this.shadowRoot.getElementById("testimo-list");
      u && (this.clickListeners = [], u.querySelectorAll(".card").forEach((c) => {
        const h = () => {
          const o = c.getAttribute("data-tid");
          o && this.trackClick(o);
        };
        c.addEventListener("click", h), this.clickListeners.push(() => c.removeEventListener("click", h));
      }));
    }
    async trackClick(t) {
      const e = this.getAttribute("organization-id");
      if (!(!e || !t))
        try {
          await fetch(`${this.apiUrl}/analytics/track`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              organizationId: e,
              testimonialId: t,
              type: "click",
              metadata: { widget: !0 }
            })
          });
        } catch {
        }
    }
  }
  customElements.define("testimo-widget", s);
}
