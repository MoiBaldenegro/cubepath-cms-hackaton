import styles from '../../features/FeaturesPage.module.css';

const FastLightweight = () => (
  <section className={styles.section}>
    <div className={styles.sectionContent}>
      <h2 className={styles.sectionTitle}>
        <span className={styles.sectionIcon}>🚀</span>
        Ultra rápido y ligero
      </h2>
      <p className={styles.sectionDesc}>
        Widget de menos de 10kb gzipped. Lazy loading automático, 
        cache inteligente y performance optimizada para Core Web Vitals.
      </p>
      <div className={styles.codeBlock}>
        <pre>{`# Stats de Bundle
testimo-widget: 8.2kb gzipped
Time to Interactive: <100ms
Lighthouse Performance: 100`}</pre>
      </div>
      <p className={styles.note}>
        <strong>Velocidad importa:</strong> Un widget lento mata la conversión. Testimo no compromete velocidad.
      </p>
    </div>
  </section>
);

export default FastLightweight;
