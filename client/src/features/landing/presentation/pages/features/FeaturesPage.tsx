import styles from './FeaturesPage.module.css';
import InstantIntegration from './sections/InstantIntegration';
import AdvancedCustomization from './sections/AdvancedCustomization';
import SecurityControl from './sections/SecurityControl';
import MultiPlatformSDK from './sections/MultiPlatformSDK';
import SelfHostedReady from './sections/SelfHostedReady';
import CustomizableWidgets from './sections/CustomizableWidgets';
import EnterpriseSecurity from './sections/EnterpriseSecurity';
import FastLightweight from './sections/FastLightweight';

const TestimoLogo = () => (
  <svg width="32" height="32" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="notif_grad_feat" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38bdf8"/>
        <stop offset="100%" stopColor="#2563eb"/> 
      </linearGradient>
      <mask id="cutout-mask-feat">
        <rect width="100%" height="100%" fill="white"/>
        <circle cx="416" cy="112" r="80" fill="black"/>
      </mask>
    </defs>
    <rect x="64" y="80" width="384" height="160" rx="80" fill="#18181B"/>
    <rect x="176" y="208" width="160" height="256" rx="80" fill="#18181B"/>
    <circle cx="416" cy="112" r="80" fill="#18181B"/>
    <rect x="96" y="112" width="320" height="96" rx="48" fill="white" mask="url(#cutout-mask-feat)"/>
    <rect x="208" y="240" width="96" height="192" rx="48" fill="white"/>
    <circle cx="416" cy="112" r="48" fill="url(#notif_grad_feat)"/>
  </svg>
);

export const FeaturesPage = () => (
  <div className={styles.container}>
    <div className={`${styles.glowOrb} ${styles.glowOrb1}`}></div>
    
    <header className={styles.header}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <TestimoLogo />
        <span style={{ fontSize: '1rem', color: 'var(--brand-hover)', fontWeight: 600 }}>Testimo</span>
      </div>
      <h1 className={styles.title}>Características de Testimo</h1>
      <p className={styles.subtitle}>
        Descubre cómo Testimo transforma la gestión de testimonios en tu producto SaaS. 
        Cada funcionalidad diseñada para maximizar el impacto del social proof.
      </p>
    </header>

    <InstantIntegration />
    <AdvancedCustomization />
    <SecurityControl />
    <MultiPlatformSDK />
    <SelfHostedReady />
    <CustomizableWidgets />
    <EnterpriseSecurity />
    <FastLightweight />
  </div>
);

export default FeaturesPage;
