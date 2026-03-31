import styles from '../../features/FeaturesPage.module.css';


const InstantIntegration = () => (
  <section className={styles.section}>
    <div className={styles.sectionContent}>
      <h2 className={styles.sectionTitle}>
        <span className={styles.sectionIcon}>⚡</span>
        Integración instantánea
      </h2>
      <p className={styles.sectionDesc}>
        Instala el SDK y embebe el widget en segundos en cualquier stack: React, Vue, Angular, Next.js o Vanilla JS. 
        Solo importa el web component y comienza a recolectar testimonios sin fricción.
      </p>
      <div className={styles.codeBlock}>
        <pre>{`<script src="https://cdn.testimo.app/sdk.js"></script>
<testimo-widget organization-id="TU_ORG_ID"></testimo-widget>`}</pre>
      </div>
      <p className={styles.note}>
        <strong>¿Por qué importa?</strong> Reduce el time-to-market y permite a equipos técnicos 
        y de marketing lanzar pruebas A/B o campañas de social proof en minutos.
      </p>
    </div>
  </section>
);

export default InstantIntegration;
