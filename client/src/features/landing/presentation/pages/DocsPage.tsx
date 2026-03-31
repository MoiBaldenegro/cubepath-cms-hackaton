import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './DocsPage.module.css';

const TestimoLogo = () => (
  <svg width="36" height="36" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="notif_grad_docs" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38bdf8"/>
        <stop offset="100%" stopColor="#2563eb"/> 
      </linearGradient>
      <mask id="cutout-mask-docs">
        <rect width="100%" height="100%" fill="white"/>
        <circle cx="416" cy="112" r="80" fill="black"/>
      </mask>
    </defs>
    <rect x="64" y="80" width="384" height="160" rx="80" fill="#18181B"/>
    <rect x="176" y="208" width="160" height="256" rx="80" fill="#18181B"/>
    <circle cx="416" cy="112" r="80" fill="#18181B"/>
    <rect x="96" y="112" width="320" height="96" rx="48" fill="white" mask="url(#cutout-mask-docs)"/>
    <rect x="208" y="240" width="96" height="192" rx="48" fill="white"/>
    <circle cx="416" cy="112" r="48" fill="url(#notif_grad_docs)"/>
  </svg>
);

const navItems = [
  {
    section: 'Empezando',
    items: [
      { id: 'introduccion', label: 'Introducción', icon: '📖' },
      { id: 'quickstart', label: 'Quick Start', icon: '⚡' },
      { id: 'instalacion', label: 'Instalación', icon: '📦' },
    ]
  },
  {
    section: 'Widget',
    items: [
      { id: 'widget-basico', label: 'Uso Básico', icon: '🔧' },
      { id: 'widget-opciones', label: 'Opciones', icon: '⚙️' },
      { id: 'widget-temas', label: 'Temas', icon: '🎨' },
    ]
  },
  {
    section: 'API',
    items: [
      { id: 'api-rest', label: 'API REST', icon: '🔌' },
      { id: 'autenticacion', label: 'Autenticación', icon: '🔐' },
      { id: 'endpoints', label: 'Endpoints', icon: '📡' },
    ]
  },
  {
    section: 'Referencia',
    items: [
      { id: 'referencia', label: 'Referencia Completa', icon: '📋' },
    ]
  },
];

export const DocsPage = () => {
  const [activeSection, setActiveSection] = useState('introduccion');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.glowOrb} ${styles.glowOrb1}`}></div>
      <div className={`${styles.glowOrb} ${styles.glowOrb2}`}></div>

      <nav className={styles.navbar}>
        <Link to="/" className={styles.logoSection}>
          <div className={styles.logoIcon}>
            <TestimoLogo />
          </div>
          <span className={styles.logoText}>Testimo</span>
        </Link>
        <div className={styles.navLinks}>
          <Link to="/features" className={styles.navLink}>Características</Link>
          <Link to="/pricing" className={styles.navLink}>Precios</Link>
          <Link to="/docs" className={`${styles.navLink} ${styles.active}`}>Docs</Link>
        </div>
        <Link to="/register" className={styles.navCta}>Comenzar</Link>
      </nav>

      <div className={styles.mobileNav}>
        <select 
          className={styles.mobileNavSelect}
          value={activeSection}
          onChange={(e) => scrollToSection(e.target.value)}
        >
          {navItems.map((section) => (
            <optgroup label={section.section} key={section.section}>
              {section.items.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className={styles.main}>
        <aside className={styles.sidebar}>
          {navItems.map((section) => (
            <div key={section.section} className={styles.sidebarSection}>
              <div className={styles.sidebarTitle}>{section.section}</div>
              <div className={styles.sidebarLinks}>
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    className={`${styles.sidebarLink} ${activeSection === item.id ? styles.active : ''}`}
                    onClick={() => scrollToSection(item.id)}
                  >
                    <span className={styles.sidebarIcon}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>

        <div className={styles.content}>
          <section id="introduccion" className={styles.section}>
            <h1 className={styles.sectionTitle}>Documentación de Testimo</h1>
            <p className={styles.sectionSubtitle}>
              La plataforma completa para recolectar, gestionar y mostrar testimonios de clientes. 
              Esta guía te ayudará a integrar Testimo en tu aplicación en minutos.
            </p>

            <div className={styles.note}>
              <span className={styles.noteIcon}>💡</span>
              <p className={styles.noteText}>
                <strong>¿Nuevo en Testimo?</strong> Empieza con la sección Quick Start para ver un ejemplo 
                funcionando en menos de 5 minutos.
              </p>
            </div>

            <div className={styles.featureGrid}>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>⚡</div>
                <div className={styles.featureContent}>
                  <h4>Integración rápida</h4>
                  <p>Un solo script o npm package para empezar</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>🎨</div>
                <div className={styles.featureContent}>
                  <h4>Personalizable</h4>
                  <p>Temas, colores y layouts totalmente configurables</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>🔐</div>
                <div className={styles.featureContent}>
                  <h4>Seguro</h4>
                  <p>JWT, whitelist de dominios y anti-spam integrado</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>📊</div>
                <div className={styles.featureContent}>
                  <h4>Analíticas</h4>
                  <p>Métricas de views, clics y conversiones</p>
                </div>
              </div>
            </div>
          </section>

          <section id="quickstart" className={styles.section}>
            <h2 className={styles.sectionTitle}>Quick Start</h2>
            <p className={styles.sectionSubtitle}>
              Sigue estos pasos para tener el widget funcionando en tu proyecto.
            </p>

            <ol className={styles.stepList}>
              <li className={styles.stepItem}>
                <span className={styles.stepNumber}>1</span>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Regístrate en Testimo</h3>
                  <p className={styles.stepDesc}>
                    Crea una cuenta gratuita en <Link to="/register" style={{ color: 'var(--brand-hover)' }}>testimo.app</Link> y obtén tu Organization ID.
                  </p>
                </div>
              </li>
              <li className={styles.stepItem}>
                <span className={styles.stepNumber}>2</span>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Añade el widget a tu HTML</h3>
                  <p className={styles.stepDesc}>
                    Copia y pega el script en el <code className={styles.inlineCode}>&lt;head&gt;</code> de tu página.
                  </p>
                </div>
              </li>
              <li className={styles.stepItem}>
                <span className={styles.stepNumber}>3</span>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>¡Listo!</h3>
                  <p className={styles.stepDesc}>
                    El widget se cargará automáticamente y comenzará a mostrar testimonios.
                  </p>
                </div>
              </li>
            </ol>

            <div className={styles.codeBlock}>
              <div className={styles.codeBlockTitle}>HTML completo</div>
              <pre>{`<!DOCTYPE html>
<html>
<head>
  <title>Mi Web</title>
  <!-- Añade el script de Testimo -->
  <script 
    src="https://cdn.testimo.app/widget/embed.js"
    organization-id="TU_ORG_ID"
    theme="light"
    layout="grid"
    async>
  </script>
</head>
<body>
  <h1>Bienvenido a mi web</h1>
  
  <!-- El widget se renderiza aquí automáticamente -->
  
</body>
</html>`}</pre>
            </div>
          </section>

          <section id="instalacion" className={styles.section}>
            <h2 className={styles.sectionTitle}>Instalación</h2>
            <p className={styles.sectionSubtitle}>
              Elige el método de instalación que mejor se adapte a tu proyecto.
            </p>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Via npm (Framework moderno)</h3>
            <div className={styles.codeBlock}>
              <div className={styles.codeBlockTitle}>Terminal</div>
              <pre>{`# Instala el paquete
npm install testimo-widget

# o con yarn
yarn add testimo-widget`}</pre>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Uso con React</h3>
            <div className={styles.codeBlock}>
              <div className={styles.codeBlockTitle}>ReactComponent.jsx</div>
              <pre>{`import 'testimo-widget';

export function Testimonials() {
  return (
    <testimo-widget 
      organization-id="TU_ORG_ID"
      theme="dark"
      layout="grid"
    />
  );
}`}</pre>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Uso con Vue</h3>
            <div className={styles.codeBlock}>
              <div className={styles.codeBlockTitle}>VueComponent.vue</div>
              <pre>{`<script setup>
import 'testimo-widget';
</script>

<template>
  <testimo-widget 
    organization-id="TU_ORG_ID"
    theme="dark"
    layout="grid"
  />
</template>`}</pre>
            </div>
          </section>

          <section id="widget-basico" className={styles.section}>
            <h2 className={styles.sectionTitle}>Uso Básico del Widget</h2>
            <p className={styles.sectionSubtitle}>
              El widget de Testimo es un Web Component que puedes personalizar con diferentes atributos.
            </p>

            <div className={styles.codeBlock}>
              <div className={styles.codeBlockTitle}>Sintaxis básica</div>
              <pre>{`<testimo-widget 
  organization-id="TU_ORG_ID"
  theme="light"
  layout="grid"
  max-items="6"
></testimo-widget>`}</pre>
            </div>

            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Widget de recopilación</h3>
            <p className={styles.sectionSubtitle}>
              Para permitir a los usuarios enviar testimonios, usa el atributo <code className={styles.inlineCode}>mode="collect"</code>:
            </p>
            <div className={styles.codeBlock}>
              <pre>{`<testimo-widget 
  organization-id="TU_ORG_ID"
  mode="collect"
  theme="dark"
></testimo-widget>`}</pre>
            </div>
          </section>

          <section id="widget-opciones" className={styles.section}>
            <h2 className={styles.sectionTitle}>Opciones del Widget</h2>
            <p className={styles.sectionSubtitle}>
              Personaliza el widget con las siguientes opciones.
            </p>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Atributo</th>
                  <th>Valores</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code className={styles.inlineCode}>organization-id</code></td>
                  <td>string</td>
                  <td>Tu ID de organización (requerido)</td>
                </tr>
                <tr>
                  <td><code className={styles.inlineCode}>theme</code></td>
                  <td>light | dark</td>
                  <td>Tema visual del widget</td>
                </tr>
                <tr>
                  <td><code className={styles.inlineCode}>layout</code></td>
                  <td>grid | list | slider</td>
                  <td>Forma de mostrar los testimonios</td>
                </tr>
                <tr>
                  <td><code className={styles.inlineCode}>max-items</code></td>
                  <td>number</td>
                  <td>Número máximo de testimonios a mostrar</td>
                </tr>
                <tr>
                  <td><code className={styles.inlineCode}>mode</code></td>
                  <td>display | collect</td>
                  <td>Modo visualización o recopilación</td>
                </tr>
                <tr>
                  <td><code className={styles.inlineCode}>primary-color</code></td>
                  <td>hex color</td>
                  <td>Color primario personalizado</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section id="widget-temas" className={styles.section}>
            <h2 className={styles.sectionTitle}>Temas Personalizados</h2>
            <p className={styles.sectionSubtitle}>
              Personaliza completamente la apariencia del widget.
            </p>

            <div className={styles.codeBlock}>
              <div className={styles.codeBlockTitle}>Ejemplo con CSS variables</div>
              <pre>{`<style>
  testimo-widget {
    --testimo-primary: #6366f1;
    --testimo-radius: 16px;
    --testimo-shadow: true;
    --testimo-font: 'Inter', sans-serif;
  }
</style>

<testimo-widget 
  organization-id="TU_ORG_ID"
  custom-styles="true"
></testimo-widget>`}</pre>
            </div>
          </section>

          <section id="api-rest" className={styles.section}>
            <h2 className={styles.sectionTitle}>API REST</h2>
            <p className={styles.sectionSubtitle}>
              Accede a los endpoints de Testimo para integraciones headless.
            </p>

            <div className={styles.apiEndpoint}>
              <span className={`${styles.method} ${styles.get}`}>GET</span>
              <span className={styles.endpoint}>/api/v1/testimonials</span>
            </div>
            <p style={{ marginBottom: '1.5rem', color: 'var(--foreground-secondary)' }}>
              Obtiene todos los testimonios de tu organización.
            </p>

            <div className={styles.apiEndpoint}>
              <span className={`${styles.method} ${styles.post}`}>POST</span>
              <span className={styles.endpoint}>/api/v1/testimonials</span>
            </div>
            <p style={{ marginBottom: '1.5rem', color: 'var(--foreground-secondary)' }}>
              Crea un nuevo testimonio.
            </p>

            <div className={styles.apiEndpoint}>
              <span className={`${styles.method} ${styles.get}`}>GET</span>
              <span className={styles.endpoint}>/api/v1/testimonials/:id</span>
            </div>
            <p style={{ marginBottom: '1.5rem', color: 'var(--foreground-secondary)' }}>
              Obtiene un testimonio específico.
            </p>

            <div className={styles.apiEndpoint}>
              <span className={`${styles.method} ${styles.delete}`}>DELETE</span>
              <span className={styles.endpoint}>/api/v1/testimonials/:id</span>
            </div>
            <p style={{ color: 'var(--foreground-secondary)' }}>
              Elimina un testimonio.
            </p>
          </section>

          <section id="autenticacion" className={styles.section}>
            <h2 className={styles.sectionTitle}>Autenticación</h2>
            <p className={styles.sectionSubtitle}>
              La API usa JWT (JSON Web Tokens) para autenticación.
            </p>

            <div className={styles.codeBlock}>
              <div className={styles.codeBlockTitle}>Header de autenticación</div>
              <pre>{`Authorization: Bearer YOUR_JWT_TOKEN`}</pre>
            </div>

            <div className={styles.note}>
              <span className={styles.noteIcon}>🔑</span>
              <p className={styles.noteText}>
                <strong>Obtén tu token</strong> desde el dashboard de Testimo en Settings → API Keys. 
                Nunca expongas tu token en código del cliente.
              </p>
            </div>
          </section>

          <section id="endpoints" className={styles.section}>
            <h2 className={styles.sectionTitle}>Endpoints Completos</h2>
            <p className={styles.sectionSubtitle}>
              Referencia de todos los endpoints disponibles.
            </p>

            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Testimonios</h3>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Método</th>
                  <th>Endpoint</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className={`${styles.method} ${styles.get}`}>GET</span></td>
                  <td>/v1/testimonials</td>
                  <td>Lista todos los testimonios</td>
                </tr>
                <tr>
                  <td><span className={`${styles.method} ${styles.post}`}>POST</span></td>
                  <td>/v1/testimonials</td>
                  <td>Crea un testimonio</td>
                </tr>
                <tr>
                  <td><span className={`${styles.method} ${styles.get}`}>GET</span></td>
                  <td>/v1/testimonials/:id</td>
                  <td>Obtiene un testimonio</td>
                </tr>
                <tr>
                  <td><span className={`${styles.method} ${styles.put}`}>PUT</span></td>
                  <td>/v1/testimonials/:id</td>
                  <td>Actualiza un testimonio</td>
                </tr>
                <tr>
                  <td><span className={`${styles.method} ${styles.delete}`}>DEL</span></td>
                  <td>/v1/testimonials/:id</td>
                  <td>Elimina un testimonio</td>
                </tr>
              </tbody>
            </table>

            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: '2rem 0 1rem' }}>Analíticas</h3>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Método</th>
                  <th>Endpoint</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className={`${styles.method} ${styles.get}`}>GET</span></td>
                  <td>/v1/analytics/stats</td>
                  <td>Estadísticas generales</td>
                </tr>
                <tr>
                  <td><span className={`${styles.method} ${styles.get}`}>GET</span></td>
                  <td>/v1/analytics/views</td>
                  <td>Vistas del widget</td>
                </tr>
                <tr>
                  <td><span className={`${styles.method} ${styles.get}`}>GET</span></td>
                  <td>/v1/analytics/clicks</td>
                  <td>Clics en testimonios</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section id="referencia" className={styles.section}>
            <h2 className={styles.sectionTitle}>Referencia Completa</h2>
            <p className={styles.sectionSubtitle}>
              Documentación técnica detallada de todos los componentes.
            </p>

            <div className={styles.note}>
              <span className={styles.noteIcon}>📚</span>
              <p className={styles.noteText}>
                <strong>¿Necesitas más ayuda?</strong> Contáctanos en{' '}
                <a href="mailto:support@testimo.app" style={{ color: 'var(--brand-hover)' }}>support@testimo.app</a> 
                o visita nuestro <a href="#" style={{ color: 'var(--brand-hover)' }}>GitHub</a> para soporte técnico.
              </p>
            </div>

            <div className={styles.featureGrid} style={{ marginTop: '2rem' }}>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>📧</div>
                <div className={styles.featureContent}>
                  <h4>Soporte por Email</h4>
                  <p>support@testimo.app</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>💬</div>
                <div className={styles.featureContent}>
                  <h4>Discord</h4>
                  <p>Únete a nuestra comunidad</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>🐙</div>
                <div className={styles.featureContent}>
                  <h4>GitHub</h4>
                  <p>Reporta issues y contribute</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          © {new Date().getFullYear()} Testimo. Documentación v1.0 · <a href="mailto:hello@testimo.app">Contacto</a>
        </p>
      </footer>
    </div>
  );
};

export default DocsPage;
