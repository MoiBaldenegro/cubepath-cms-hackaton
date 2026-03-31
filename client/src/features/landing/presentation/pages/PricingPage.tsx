import { Link } from 'react-router-dom';
import styles from './PricingPage.module.css';

const TestimoLogo = () => (
  <svg width="36" height="36" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="notif_grad_pricing" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38bdf8"/>
        <stop offset="100%" stopColor="#2563eb"/> 
      </linearGradient>
      <mask id="cutout-mask-pricing">
        <rect width="100%" height="100%" fill="white"/>
        <circle cx="416" cy="112" r="80" fill="black"/>
      </mask>
    </defs>
    <rect x="64" y="80" width="384" height="160" rx="80" fill="#18181B"/>
    <rect x="176" y="208" width="160" height="256" rx="80" fill="#18181B"/>
    <circle cx="416" cy="112" r="80" fill="#18181B"/>
    <rect x="96" y="112" width="320" height="96" rx="48" fill="white" mask="url(#cutout-mask-pricing)"/>
    <rect x="208" y="240" width="96" height="192" rx="48" fill="white"/>
    <circle cx="416" cy="112" r="48" fill="url(#notif_grad_pricing)"/>
  </svg>
);

const plans = [
  {
    icon: '🆓',
    name: 'Free',
    price: '0',
    description: 'Perfecto para empezar y proyectos personales',
    features: [
      { text: 'Hasta 50 testimonios', included: true },
      { text: '1 organización', included: true },
      { text: 'Widget básico', included: true },
      { text: '3 widgets embedidos', included: true },
      { text: 'Analíticas básicas', included: true },
      { text: 'Soporte por email', included: true },
      { text: 'Exportación CSV', included: false },
      { text: 'White-label', included: false },
      { text: 'API access', included: false },
      { text: 'SSO/SAML', included: false },
    ],
    cta: 'Empezar gratis',
    ctaLink: '/register',
    featured: false,
    hackathon: false,
  },
  {
    icon: '🏆',
    name: 'Hackathon',
    price: '0',
    description: 'Exclusivo para participantes del hackatón Cubepath',
    features: [
      { text: 'Testimonios ilimitados', included: true },
      { text: '5 organizaciones', included: true },
      { text: 'Widget premium completo', included: true },
      { text: 'Widgets ilimitados', included: true },
      { text: 'Analíticas avanzadas', included: true },
      { text: 'Soporte prioritario', included: true },
      { text: 'Exportación Excel/CSV', included: true },
      { text: 'White-label básico', included: true },
      { text: 'API access completo', included: true },
      { text: 'Dashboard completo', included: true },
    ],
    cta: 'Obtener acceso',
    ctaLink: '/register',
    featured: false,
    hackathon: true,
    badge: 'Exclusivo Hackathon',
  },
  {
    icon: '⚡',
    name: 'Pro',
    price: '29',
    description: 'Para startups y equipos en crecimiento',
    features: [
      { text: 'Testimonios ilimitados', included: true },
      { text: '10 organizaciones', included: true },
      { text: 'Widget premium + themes', included: true },
      { text: 'Widgets ilimitados', included: true },
      { text: 'Analíticas avanzadas', included: true },
      { text: 'Soporte prioritario', included: true },
      { text: 'Exportación Excel/CSV', included: true },
      { text: 'White-label', included: true },
      { text: 'API access completo', included: true },
      { text: 'SSO básico', included: false },
    ],
    cta: 'Comenzar con Pro',
    ctaLink: '/register?plan=pro',
    featured: true,
    hackathon: false,
    badge: 'Más popular',
  },
  {
    icon: '🏢',
    name: 'Enterprise',
    price: '99',
    description: 'Para empresas con necesidades avanzadas',
    features: [
      { text: 'Todo lo de Pro', included: true },
      { text: 'Organizaciones ilimitadas', included: true },
      { text: 'Widget custom + themes', included: true },
      { text: 'Widgets ilimitados', included: true },
      { text: 'Analíticas enterprise', included: true },
      { text: 'Soporte dedicado 24/7', included: true },
      { text: 'Exportación avanzada', included: true },
      { text: 'White-label completo', included: true },
      { text: 'API + Webhooks', included: true },
      { text: 'SSO/SAML completo', included: true },
    ],
    cta: 'Contactar ventas',
    ctaLink: 'mailto:enterprise@testimo.app',
    featured: false,
    hackathon: false,
  },
];

const faqs = [
  {
    question: '¿Puedo cambiar de plan después?',
    answer: 'Sí, puedes actualizar o downgradear tu plan en cualquier momento. Los cambios se aplican inmediatamente y se ajustan proporcionalmente.',
  },
  {
    question: '¿El plan Hackathon tiene fecha de expiración?',
    answer: 'El plan Hackathon es válido durante el período del hackatón y 6 meses adicionales. Después podrás migrar a cualquier plan disponible.',
  },
  {
    question: '¿Qué incluye el widget embebible?',
    answer: 'Todos los planes incluyen acceso al widget web component que puedes personalizar con tu theme, colores y layout preferido.',
  },
  {
    question: '¿Puedo usar mi propio backend?',
    answer: 'Sí, con los planes Pro y Enterprise puedes conectar el widget a tu propia API. El plan Enterprise incluye self-hosting completo.',
  },
  {
    question: '¿Hay descuentos para startups o educación?',
    answer: 'Sí, ofrecemos descuentos especiales para startups early-stage y organizaciones educativas. Contáctanos para más información.',
  },
];

export const PricingPage = () => {
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
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/features" className={styles.navLink}>Características</Link>
          <Link to="/register" className={styles.navCta}>Comenzar</Link>
        </div>
      </nav>

      <header className={styles.header}>
        <div className={styles.badge}>
          <span>🎉</span>
          Plan Hackathon disponible - ¡Gratis para participantes!
        </div>
        <h1 className={styles.title}>Precios simples y transparentes</h1>
        <p className={styles.subtitle}>
          Elige el plan que mejor se adapte a tus necesidades. Empieza gratis y escala cuando lo necesites.
        </p>
      </header>

      <section className={styles.plansSection}>
        <div className={styles.plansGrid}>
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`${styles.planCard} ${plan.featured ? styles.featured : ''} ${plan.hackathon ? styles.hackathon : ''}`}
            >
              {plan.badge && (
                <span className={styles.planBadge}>{plan.badge}</span>
              )}
              
              <div className={styles.planHeader}>
                <div className={styles.planIcon}>{plan.icon}</div>
                <h3 className={styles.planName}>{plan.name}</h3>
                <div className={styles.planPrice}>
                  <span className={styles.priceCurrency}>$</span>
                  <span className={styles.priceAmount}>{plan.price}</span>
                  <span className={styles.pricePeriod}>/mes</span>
                </div>
                <p className={styles.planDescription}>{plan.description}</p>
              </div>

              <ul className={styles.planFeatures}>
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className={styles.planFeature}>
                    <span className={`${styles.featureIcon} ${!feature.included ? styles.disabled : ''}`}>
                      {feature.included ? '✓' : '✗'}
                    </span>
                    {feature.text}
                  </li>
                ))}
              </ul>

              <Link to={plan.ctaLink} className={styles.planCta}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.faqSection}>
        <h2 className={styles.faqTitle}>Preguntas frecuentes</h2>
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>{faq.question}</h3>
              <p className={styles.faqAnswer}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          ¿Preguntas? <a href="mailto:hello@testimo.app">Contáctanos</a>
        </p>
      </footer>
    </div>
  );
};

export default PricingPage;
