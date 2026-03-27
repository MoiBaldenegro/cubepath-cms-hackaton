import styles from "../../LandingPage.module.css";

const MultiPlatformSDK = () => (
  <section className={styles.selfHostSection}>
    <div className={styles.selfHostContent}>
      <h2 className={styles.selfHostTitle}>Multi-Platform SDK 🌐</h2>
      <p className={styles.selfHostSubtitle}>
        Un solo SDK para React, Vue, Angular o Vanilla JS. Integra testimonios en cualquier frontend moderno sin dependencias adicionales.
      </p>
      <pre className={styles.selfHostCodeBlock}>{`npm install @cubepath/sdk`}</pre>
      <p className={styles.selfHostNote}>
        <b>¿Por qué importa?</b> Facilita la integración en proyectos existentes y acelera la adopción cross-team.
      </p>
    </div>
  </section>
);

export default MultiPlatformSDK;
