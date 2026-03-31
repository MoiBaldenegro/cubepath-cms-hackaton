import styles from '../../features/FeaturesPage.module.css';


const MultiPlatformSDK = () => (
  <section className={styles.section}>
    <div className={styles.sectionContent}>
      <h2 className={styles.sectionTitle}>
        <span className={styles.sectionIcon}>🌐</span>
        SDK Multi-plataforma
      </h2>
      <p className={styles.sectionDesc}>
        Librerías oficiales para React, Vue, Angular, Next.js, Svelte y más. 
        API REST completa para integraciones headless o custom.
      </p>
      <div className={styles.codeBlock}>
        <pre>{`// React
import 'testimo-widget';

<testimo-widget organization-id="tu-org" />

// Vue
<script setup>
import 'testimo-widget';
</script>

<testimo-widget organization-id="tu-org" />`}</pre>
      </div>
      <p className={styles.note}>
        <strong>Multi-stack:</strong> El mismo widget, la misma experiencia. Elige tu framework favorito.
      </p>
    </div>
  </section>
);

export default MultiPlatformSDK;
