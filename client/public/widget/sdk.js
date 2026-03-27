var h = Object.defineProperty;
var u = (n, r, l) => r in n ? h(n, r, { enumerable: !0, configurable: !0, writable: !0, value: l }) : n[r] = l;
var c = (n, r, l) => (u(n, typeof r != "symbol" ? r + "" : r, l), l);
if (typeof window < "u" && !customElements.get("cubepath-widget")) {
  class n extends HTMLElement {
    constructor() {
      super();
      c(this, "_data", []);
      c(this, "_loading", !0);
      c(this, "_error", null);
      c(this, "_submitting", !1);
      this.attachShadow({ mode: "open" });
    }
    static get observedAttributes() {
      return ["organization-id", "theme", "layout", "api-url"];
    }
    connectedCallback() {
      this.fetchData();
    }
    get apiUrl() {
      return this.getAttribute("api-url") || "http://cubepathhackaton-api-aymrvj-31e30c-108-165-47-144.traefik.me";
    }
    attributeChangedCallback(i, t, e) {
      t !== e && (i === "organization-id" || i === "api-url") ? this.fetchData() : t !== e && this.render();
    }
    async fetchData() {
      const i = this.getAttribute("organization-id");
      if (!i) {
        this._error = "Organization ID is missing", this._loading = !1, this.render();
        return;
      }
      this._loading = !0, this.render();
      try {
        const t = await fetch(`${this.apiUrl}/widget/data?organizationId=${i}`);
        if (!t.ok)
          throw new Error("Failed to fetch testimonials");
        this._data = await t.json();
      } catch (t) {
        this._error = t.message;
      } finally {
        this._loading = !1, this.render();
      }
    }
    async _handleSubmit(i) {
      var p;
      i.preventDefault();
      const t = i.target, e = new FormData(t), g = Object.fromEntries(e.entries()), s = this.getAttribute("organization-id"), a = (p = this.shadowRoot) == null ? void 0 : p.getElementById("form-feedback");
      if (this._submitting)
        return;
      this._submitting = !0;
      const o = t.querySelector("button");
      o && (o.disabled = !0), o && (o.textContent = "Submitting...");
      try {
        if (!(await fetch(`${this.apiUrl}/widget/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...g, organizationId: s })
        })).ok)
          throw new Error("Failed to submit");
        t.reset(), a && (a.textContent = "Thank you! Your testimonial has been submitted for review.", a.className = "success-msg");
      } catch {
        a && (a.textContent = "Error submitting testimonial. Please try again.", a.className = "error-msg");
      } finally {
        this._submitting = !1, o && (o.disabled = !1, o.textContent = "Submit Testimonial");
      }
    }
    render() {
      var o;
      if (!this.shadowRoot)
        return;
      const i = this.getAttribute("theme") || "light", t = this.getAttribute("layout") || "grid", e = i === "dark", g = `
        :host {
          display: block;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        }
        .container {
          padding: 24px;
          background-color: ${e ? "#1a1a1a" : "#ffffff"};
          color: ${e ? "#ffffff" : "#333333"};
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
          border: 1px solid ${e ? "#333" : "#eee"};
          padding: 20px;
          border-radius: 12px;
          background-color: ${e ? "#2d2d2d" : "#f8f9fa"};
          transition: transform 0.2s ease;
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
            border-top: 1px solid ${e ? "#333" : "#eee"};
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
            border: 1px solid ${e ? "#444" : "#ccc"};
            background-color: ${e ? "#2d2d2d" : "#fff"};
            color: ${e ? "#fff" : "#333"};
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
        button:hover { background-color: #2563eb; }
        button:disabled { background-color: #93c5fd; cursor: not-allowed; }
        .success-msg { color: #10b981; text-align: center; margin-top: 10px; font-weight: 500;}
        .error-msg { color: #ef4444; text-align: center; margin-top: 10px; }
      `;
      let s = "";
      if (this._loading)
        s = '<div class="loading">Loading testimonials...</div>';
      else if (this._error)
        s = `<div class="error">Error: ${this._error}</div>`;
      else if (this._data.length === 0)
        s = '<div class="loading">No approved testimonials yet.</div>';
      else {
        const p = this._data.map((d) => {
          const f = d.rating ? "★".repeat(d.rating) + "☆".repeat(5 - d.rating) : "";
          // YouTube embed if videoUrl is present and valid
          let videoEmbed = "";
          if (d.videoUrl) {
            const ytMatch = d.videoUrl.match(/(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/watch\?v=|youtu.be\/)([\w-]{11})/);
            if (ytMatch) {
              const embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
              videoEmbed = `<div style=\"margin-bottom:12px;text-align:center;\"><iframe width=\"320\" height=\"180\" src=\"${embedUrl}\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen style=\"border-radius:10px;background:#000;\"></iframe></div>`;
            }
          }
          let imageBlock = "";
          if (d.imageUrl) {
            imageBlock = `<div style=\"margin-bottom:12px;text-align:center;\"><img src=\"${d.imageUrl}\" alt=\"Imagen del testimonio\" style=\"max-width:320px;max-height:220px;border-radius:10px;border:1px solid #eee;box-shadow:0 2px 12px #0001;background:#fff;\" /></div>`;
          }
          return `
            <div class="card">
              ${videoEmbed || imageBlock}
              <p>"${d.content}"</p>
              <div class="footer">
                <strong>${d.author}</strong>
                <div class="rating">${f}</div>
              </div>
            </div>
          `;
        }).join("");
        s = `<div class="${t}">${p}</div>`;
      }
      const a = `
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
          ${s}
          ${a}
        </div>
      `, (o = this.shadowRoot.getElementById("testimonial-form")) == null || o.addEventListener("submit", this._handleSubmit.bind(this));
    }
  }
  customElements.define("cubepath-widget", n);
}
