import { Link, useNavigate } from 'react-router-dom';
import styles from './LandingPage.module.css';
import { useAuth } from '../../../../shared/contexts/useAuth';

const TestimoLogo = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="notif_grad_landing" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38bdf8"/>
        <stop offset="100%" stopColor="#2563eb"/> 
      </linearGradient>
      <mask id="cutout-mask-landing">
        <rect width="100%" height="100%" fill="white"/>
        <circle cx="416" cy="112" r="80" fill="black"/>
      </mask>
    </defs>
    <rect x="64" y="80" width="384" height="160" rx="80" fill="#18181B"/>
    <rect x="176" y="208" width="160" height="256" rx="80" fill="#18181B"/>
    <circle cx="416" cy="112" r="80" fill="#18181B"/>
    <rect x="96" y="112" width="320" height="96" rx="48" fill="white" mask="url(#cutout-mask-landing)"/>
    <rect x="208" y="240" width="96" height="192" rx="48" fill="white"/>
    <circle cx="416" cy="112" r="48" fill="url(#notif_grad_landing)"/>
  </svg>
);

export const LandingPage = () => {
  const { loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleDemo = (e: React.MouseEvent) => {
    e.preventDefault();
    loginAsDemo();
    navigate('/dashboard');
  };

  const features = [
    {
      icon: '⚡',
      title: 'Integración instantánea',
      desc: 'Compatible con React, Vue, Angular, Next.js y cualquier framework moderno. Instala el SDK, importa el web component y listo.',
    },
    {
      icon: '🎨',
      title: 'Personalización avanzada',
      desc: 'Modos claro/oscuro, layouts grid/list, slots y CSS variables. Extiende el widget o crea tu propia UI sobre la API.',
    },
    {
      icon: '🔐',
      title: 'Seguridad y control',
      desc: 'Whitelist de dominios, protección anti-spam, autenticación JWT y cumplimiento para empresas.',
    },
    {
      icon: '📊',
      title: 'Analíticas en tiempo real',
      desc: 'Visualiza vistas, clics, tasa de conversión y tendencias históricas. Exporta métricas a Excel con un clic.',
    },
    {
      icon: '👥',
      title: 'Multi-tenant y roles',
      desc: 'Cada organización ve solo sus datos. Soporte para administradores, editores y moderadores.',
    },
    {
      icon: '🌐',
      title: 'Autohospedaje opcional',
      desc: 'Ejecuta tu propio backend, conecta tu base de datos y mantén la experiencia sin lock-in.',
    },
  ];

  const selfHostFeatures = [
    {
      title: 'Propiedad absoluta de los datos',
      desc: 'Almacena testimonios en tu stack (Postgres, Mongo, serverless, etc).',
    },
    {
      title: 'Endpoints API custom',
      desc: 'El widget consume cualquier REST API (Node, Go, Python, serverless...).',
    },
    {
      title: 'SDK open source',
      desc: 'Audita, extiende o forkea el código. Sin cajas negras.',
    },
    {
      title: 'Integración CI/CD',
      desc: 'Automatiza despliegues, versiona el widget y conecta con pipelines internos.',
    },
  ];

  return (
    <div className={styles.container}>
      <div className={`${styles.glowOrb} ${styles.glowOrb1}`}></div>
      <div className={`${styles.glowOrb} ${styles.glowOrb2}`}></div>

      <nav className={styles.navbar}>
        <Link to="/" className={styles.logoSection}>
          <div className={styles.logoIcon}>
            <TestimoLogo size={40} />
          </div>
          <span className={styles.logoText}>Testimo</span>
        </Link>

        <div className={styles.navLinks}>
          <Link to="/features" className={styles.navLink}>Características</Link>
          <Link to="/pricing" className={styles.navLink}>Precios</Link>
          <Link to="/docs" className={styles.navLink}>Documentación</Link>
        </div>

        <div className={styles.authButtons}>
          <Link to="/login" className={styles.loginBtn}>Iniciar sesión</Link>
          <Link to="/register" className={styles.navCta}>Comenzar</Link>
        </div>
      </nav>

      <header className={styles.hero}>
        <div className={styles.badge}>
          <span className={styles.badgeDot}></span>
          Nuevo: Widgets de Testimonios Interactivos
        </div>

        <h1 className={styles.title}>
          Convierte feedback en{' '}
          <span className={styles.titleAccent}>crecimiento para tu producto</span>
        </h1>

        <p className={styles.subtitle}>
          API y SDK para recolectar, gestionar y desplegar testimonios en cualquier stack. 
          Widgets web, integración headless y control total para equipos técnicos.
        </p>

        <div className={styles.ctaGroup}>
          <Link to="/register" className={styles.primaryCta}>
            Probar gratis →
          </Link>
          <a href="#" onClick={handleDemo} className={styles.secondaryCta}>
            🚀 Ver demo interactiva
          </a>
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>47%</div>
            <div className={styles.statLabel}>Aumento en conversiones</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>&lt;10kb</div>
            <div className={styles.statLabel}>Tamaño del widget</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>5min</div>
            <div className={styles.statLabel}>Tiempo de integración</div>
          </div>
        </div>
      </header>

      <section className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Todo lo que necesitas</h2>
          <p className={styles.sectionSubtitle}>
            Una plataforma completa para gestionar testimonios de clientes y maximizar su impacto en tu negocio.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDesc}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.selfHostSection}>
        <div className={styles.selfHostContent}>
          <div className={styles.selfHostHeader}>
            <div className={styles.selfHostIcon}>🖥️</div>
            <div className={styles.selfHostInfo}>
              <h2 className={styles.selfHostTitle}>
                Autohospedaje: Control total para desarrolladores
              </h2>
              <p className={styles.selfHostSubtitle}>
                Testimo es la única plataforma de testimonios pensada para devs: ejecuta tu propio backend, 
                conecta tu base de datos y mantén la experiencia de widget y panel sin lock-in. 
                Ideal para arquitecturas enterprise, SaaS multi-tenant o proyectos con requisitos de compliance.
              </p>
            </div>
          </div>

          <ul className={styles.selfHostList}>
            {selfHostFeatures.map((item, index) => (
              <li key={index} className={styles.selfHostListItem}>
                <span className={styles.listIcon}>✓</span>
                <div className={styles.listText}>
                  <div className={styles.listTitle}>{item.title}</div>
                  <div className={styles.listDesc}>{item.desc}</div>
                </div>
              </li>
            ))}
          </ul>

          <div className={styles.codeBlock}>
            <pre>{`<testimo-widget 
  organization-id="acme-corp" 
  api-url="https://api.acme.com/testimonios"
  theme="dark"
  layout="grid"
></testimo-widget>`}</pre>
          </div>

          <div className={styles.enterpriseNote}>
            <span className={styles.enterpriseIcon}>💼</span>
            <p className={styles.enterpriseText}>
              <strong>¿Dudas técnicas?</strong> Soporte para despliegues on-premise, 
              integración con SSO, auditoría de seguridad y consultoría para arquitecturas complejas.{' '}
              <a href="mailto:enterprise@testimo.app">Contáctanos</a>.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.codeSection}>
        <h2 className={styles.codeSectionTitle}>Pensado para desarrolladores</h2>
        <p className={styles.codeSectionSubtitle}>
          API limpia, tipado fuerte, web components estándar y documentación clara. 
          Integra, automatiza y escala sin fricción.
        </p>
        <div className={styles.codeBlock}>
          <pre>{`<!-- Usa nuestro cloud o conecta tu backend propio -->
<testimo-widget 
  organization-id="tu-org-id" 
  api-url="https://api.tuempresa.com/testimonios"
></testimo-widget>`}</pre>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>Empieza hoy mismo</h2>
          <p className={styles.ctaSubtitle}>
            Regístrate gratis y comienza a recopilar testimonios en minutos.
          </p>
          <Link to="/register" className={styles.ctaButton}>
            Crear cuenta gratis →
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <Link to="/" className={styles.footerLogo}>
            <div className={styles.footerLogoIcon}>
              <TestimoLogo size={32} />
            </div>
            <span className={styles.footerLogoText}>Testimo</span>
          </Link>

          <div className={styles.footerLinks}>
            <Link to="/features" className={styles.footerLink}>Características</Link>
            <Link to="/pricing" className={styles.footerLink}>Precios</Link>
            <Link to="/docs" className={styles.footerLink}>Documentación</Link>
            <a href="mailto:hello@testimo.app" className={styles.footerLink}>Contacto</a>
          </div>

          <p className={styles.footerCopy}>
            © {new Date().getFullYear()} Testimo CMS. Hecho por y para desarrolladores.
          </p>
        </div>
      </footer>
    </div>
  );
};
