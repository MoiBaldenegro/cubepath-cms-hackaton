var b = Object.defineProperty;
var x = (d, n, m) => n in d ? b(d, n, { enumerable: !0, configurable: !0, writable: !0, value: m }) : d[n] = m;
var r = (d, n, m) => (x(d, typeof n != "symbol" ? n + "" : n, m), m);
if (typeof window < "u" && !customElements.get("testimo-widget")) {
  class d extends HTMLElement {
    constructor() {
      super();
      r(this, "_data", []);
      r(this, "_aiSummary", "");
      r(this, "_loading", !0);
      r(this, "_error", null);
      r(this, "_submitting", !1);
      // Referencias a elementos que necesitamos manipular
      r(this, "formListener", null);
      r(this, "clickListeners", []);
      r(this, "_handleSubmit", async (e) => {
        var h;
        e.preventDefault();
        const i = e.target, t = new FormData(i), g = Object.fromEntries(t.entries()), l = this.getAttribute("organization-id"), s = (h = this.shadowRoot) == null ? void 0 : h.getElementById("form-feedback");
        if (this._submitting || !l)
          return;
        this._submitting = !0;
        const a = i.querySelector("button");
        a && (a.disabled = !0, a.textContent = "Submitting...");
        try {
          if (!(await fetch(`${this.apiUrl}/widget/submit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...g, organizationId: l })
          })).ok)
            throw new Error("Failed to submit");
          i.reset(), s && (s.textContent = "Thank you! Your testimonial has been submitted for review.", s.className = "success-msg");
        } catch {
          s && (s.textContent = "Error submitting testimonial. Please try again.", s.className = "error-msg");
        } finally {
          this._submitting = !1, a && (a.disabled = !1, a.textContent = "Submit Testimonial");
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
      var e, i;
      this.formListener && ((i = (e = this.shadowRoot) == null ? void 0 : e.getElementById("testimonial-form")) == null || i.removeEventListener("submit", this.formListener), this.formListener = null), this.clickListeners.forEach((t) => t()), this.clickListeners = [];
    }
    async trackView() {
      const e = this.getAttribute("organization-id");
      if (e)
        try {
          await fetch(`${this.apiUrl}/analytics/track`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              organizationId: e,
              testimonialId: "all",
              type: "view",
              metadata: { widget: !0 }
            })
          });
        } catch {
        }
    }
    get apiUrl() {
      return this.getAttribute("api-url") || "http://cubepathhackaton-api-aymrvj-31e30c-108-165-47-144.traefik.me";
    }
    attributeChangedCallback(e, i, t) {
      i !== t && (e === "organization-id" || e === "api-url" ? this.fetchData() : this.render());
    }
    async fetchData() {
      const e = this.getAttribute("organization-id");
      if (!e) {
        this._error = "Organization ID is missing", this._loading = !1, this.render();
        return;
      }
      this._loading = !0, this._error = null, this.render();
      try {
        const i = await fetch(`${this.apiUrl}/widget/data?organizationId=${e}`);
        if (!i.ok)
          throw new Error("Failed to fetch testimonials");
        this._data = await i.json();
        let t = "";
        this._data.length > 0 ? this._data.length === 1 ? t = `Las personas comentan que: "${this._data[0].content}"` : this._data.length === 2 ? t = `Las personas comentan que: "${this._data[0].content}" y "${this._data[1].content}"` : t = `Las personas comentan que: "${this._data[0].content}", "${this._data[1].content}" y otros ${this._data.length - 2} testimonios más.` : t = "Aún no hay testimonios para analizar.", this._aiSummary = t;
      } catch (i) {
        this._error = i.message || "Failed to load testimonials";
      } finally {
        this._loading = !1, this.render();
      }
    }
    render() {
      if (!this.shadowRoot)
        return;
      this.removeAllListeners();
      const e = this.getAttribute("theme") || "light", i = this.getAttribute("layout") || "grid", t = e === "dark", g = `
        :host {
          display: block;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        }
        .container {
          padding: 24px;
          background-color: ${t ? "#1a1a1a" : "#ffffff"};
          color: ${t ? "#ffffff" : "#333333"};
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
          border: 1px solid ${t ? "#333" : "#eee"};
          padding: 20px;
          border-radius: 12px;
          background-color: ${t ? "#2d2d2d" : "#f8f9fa"};
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
          border-top: 1px solid ${t ? "#333" : "#eee"};
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
          border: 1px solid ${t ? "#444" : "#ccc"};
          background-color: ${t ? "#2d2d2d" : "#fff"};
          color: ${t ? "#fff" : "#333"};
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
      let l = "";
      if (this._loading)
        l = '<div class="loading">Loading testimonials...</div>';
      else if (this._error)
        l = `<div class="error">Error: ${this._error}</div>`;
      else {
        const c = this._aiSummary ? `<div style="padding:18px 20px;background:${t ? "#23272f" : "#f1f5f9"};border-radius:10px;margin-bottom:28px;font-size:16px;font-style:italic;color:${t ? "#cbd5e1" : "#334155"};">${this._aiSummary}</div>` : "", p = this._data.map((o) => {
          const f = o.rating ? "★".repeat(o.rating) + "☆".repeat(5 - o.rating) : "", u = o.imageUrl ? `<div style="margin-bottom:10px;"><img src="${o.imageUrl}" alt="Testimonial" style="max-width:120px;max-height:120px;border-radius:8px;border:1px solid #eee;" /></div>` : "";
          return `
            <div class="card" data-tid="${o.id}">
              ${u}
              <p>"${o.content}"</p>
              <div class="footer">
                <strong>${o.author}</strong>
                <div class="rating">${f}</div>
              </div>
            </div>
          `;
        }).join("");
        l = `${c}<div class="${i}" id="testimo-list">${p}</div>`;
      }
      const s = `
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
        <style>${g}</style>
        <div class="container">
          <h2>What People Say</h2>
          ${l}
          ${s}
        </div>
      `;
      const a = this.shadowRoot.getElementById("testimonial-form");
      a && (this.formListener = this._handleSubmit, a.addEventListener("submit", this.formListener));
      const h = this.shadowRoot.getElementById("testimo-list");
      h && (this.clickListeners = [], h.querySelectorAll(".card").forEach((c) => {
        const p = () => {
          const o = c.getAttribute("data-tid");
          o && this.trackClick(o);
        };
        c.addEventListener("click", p), this.clickListeners.push(() => c.removeEventListener("click", p));
      }));
    }
    async trackClick(e) {
      const i = this.getAttribute("organization-id");
      if (!(!i || !e))
        try {
          await fetch(`${this.apiUrl}/analytics/track`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              organizationId: i,
              testimonialId: e,
              type: "click",
              metadata: { widget: !0 }
            })
          });
        } catch {
        }
    }
  }
  customElements.define("testimo-widget", d);
}
