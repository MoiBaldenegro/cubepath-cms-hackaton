(function(o){typeof define=="function"&&define.amd?define(o):o()})(function(){"use strict";var y=Object.defineProperty;var v=(o,n,d)=>n in o?y(o,n,{enumerable:!0,configurable:!0,writable:!0,value:d}):o[n]=d;var r=(o,n,d)=>(v(o,typeof n!="symbol"?n+"":n,d),d);if(typeof window<"u"&&!customElements.get("testimo-widget")){class o extends HTMLElement{constructor(){super();r(this,"_data",[]);r(this,"_aiSummary","");r(this,"_loading",!0);r(this,"_error",null);r(this,"_submitting",!1);r(this,"formListener",null);r(this,"clickListeners",[]);r(this,"_handleSubmit",async e=>{var g;e.preventDefault();const i=e.target,t=new FormData(i),p=this.getAttribute("organization-id"),a=(g=this.shadowRoot)==null?void 0:g.getElementById("form-feedback");if(this._submitting||!p)return;this._submitting=!0;const l=i.querySelector("button");l&&(l.disabled=!0,l.textContent="Enviando...");try{if(t.append("organizationId",p),!(await fetch(`${this.apiUrl}/widget/submit`,{method:"POST",body:t})).ok)throw new Error("Failed to submit");i.reset(),a&&(a.textContent="¡Gracias! Tu testimonio ha sido enviado para revisión.",a.className="success-msg")}catch{a&&(a.textContent="Error al enviar el testimonio. Inténtalo de nuevo.",a.className="error-msg")}finally{this._submitting=!1,l&&(l.disabled=!1,l.textContent="Enviar testimonio")}});this.attachShadow({mode:"open"})}static get observedAttributes(){return["organization-id","theme","layout","api-url"]}connectedCallback(){this.fetchData(),this.trackView()}disconnectedCallback(){this.removeAllListeners()}removeAllListeners(){var e,i;this.formListener&&((i=(e=this.shadowRoot)==null?void 0:e.getElementById("testimonial-form"))==null||i.removeEventListener("submit",this.formListener),this.formListener=null),this.clickListeners.forEach(t=>t()),this.clickListeners=[]}get apiUrl(){return this.getAttribute("api-url")||"http://hackathoncubepath-server-zzxmva-37677b-108-165-47-237.traefik.me"}attributeChangedCallback(e,i,t){i!==t&&(e==="organization-id"||e==="api-url"?this.fetchData():this.render())}async trackView(){const e=this.getAttribute("organization-id");if(e)try{await fetch(`${this.apiUrl}/analytics/track`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({organizationId:e,testimonialId:"all",type:"view",metadata:{widget:!0}})})}catch{}}async fetchData(){const e=this.getAttribute("organization-id");if(!e){this._error="Organization ID is missing",this._loading=!1,this.render();return}this._loading=!0,this._error=null,this.render();try{const i=await fetch(`${this.apiUrl}/widget/data?organizationId=${e}`);if(!i.ok)throw new Error("Failed to fetch testimonials");this._data=await i.json(),this._data.length>0?this._data.length===1?this._aiSummary=`Las personas comentan que: "${this._data[0].content}"`:this._data.length===2?this._aiSummary=`Las personas comentan que: "${this._data[0].content}" y "${this._data[1].content}"`:this._aiSummary=`Las personas comentan que: "${this._data[0].content}", "${this._data[1].content}" y otros ${this._data.length-2} testimonios más.`:this._aiSummary="Aún no hay testimonios para analizar."}catch(i){this._error=i.message||"Failed to load testimonials"}finally{this._loading=!1,this.render()}}render(){if(!this.shadowRoot)return;this.removeAllListeners();const e=this.getAttribute("theme")||"light",i=this.getAttribute("layout")||"grid",t=e==="dark",p=`
        :host {
          display: block;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        }
        .container {
          padding: 24px;
          background-color: ${t?"#1a1a1a":"#ffffff"};
          color: ${t?"#ffffff":"#333333"};
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
          border: 1px solid ${t?"#333":"#eee"};
          padding: 20px;
          border-radius: 12px;
          background-color: ${t?"#2d2d2d":"#f8f9fa"};
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
          border-top: 1px solid ${t?"#333":"#eee"};
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
          border: 1px solid ${t?"#444":"#ccc"};
          background-color: ${t?"#2d2d2d":"#fff"};
          color: ${t?"#fff":"#333"};
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
      `;let a="";if(this._loading)a='<div class="loading">Cargando testimonios...</div>';else if(this._error)a=`<div class="error">Error: ${this._error}</div>`;else{const c=`
          <div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:12px;margin-bottom:12px;border-bottom:1px solid ${t?"#333":"#e5e7eb"};">
            <div style="display:flex;align-items:center;">
              <span style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;background:${t?"rgba(99,102,241,0.15)":"rgba(99,102,241,0.1)"};border:1px solid ${t?"rgba(99,102,241,0.3)":"rgba(99,102,241,0.2)"};border-radius:100px;font-size:11px;font-weight:600;color:#6366f1;text-transform:uppercase;letter-spacing:0.03em;">
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
              <span style="font-size:12px;font-weight:600;color:${t?"#94a3b8":"#64748b"};">Testimo</span>
            </div>
          </div>
        `,h=this._aiSummary?`<div style="padding:16px 18px;background:${t?"#23272f":"#f1f5f9"};border-radius:10px;margin-bottom:24px;font-size:15px;color:${t?"#cbd5e1":"#334155"};line-height:1.6;">${c}${this._aiSummary}</div>`:"",f=this._data.map(s=>{const b=s.rating?"★".repeat(s.rating)+"☆".repeat(5-s.rating):"",x=s.imageUrl?`<div style="margin-bottom:10px;"><img src="${s.imageUrl}" alt="Testimonial" style="max-width:120px;max-height:120px;border-radius:8px;border:1px solid #eee;" /></div>`:"";return`
            <div class="card" data-tid="${s.id}">
              ${x}
              <p>"${s.content}"</p>
              <div class="footer">
                <strong>${s.author}</strong>
                <div class="rating">${b}</div>
              </div>
            </div>
          `}).join("");a=`${h}<div class="${i}" id="testimo-list">${f}</div>`}const g=`
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
      `;this.shadowRoot.innerHTML=`
        <style>${p}</style>
        <div class="container">
          <h2>What People Say</h2>
          ${a}
          ${g}
        </div>
      `;const m=this.shadowRoot.getElementById("testimonial-form");m&&(this.formListener=this._handleSubmit,m.addEventListener("submit",this.formListener));const u=this.shadowRoot.getElementById("testimo-list");u&&(this.clickListeners=[],u.querySelectorAll(".card").forEach(c=>{const h=()=>{const f=c.getAttribute("data-tid");f&&this.trackClick(f)};c.addEventListener("click",h),this.clickListeners.push(()=>c.removeEventListener("click",h))}))}async trackClick(e){const i=this.getAttribute("organization-id");if(!(!i||!e))try{await fetch(`${this.apiUrl}/analytics/track`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({organizationId:i,testimonialId:e,type:"click",metadata:{widget:!0}})})}catch{}}}customElements.define("testimo-widget",o)}});
