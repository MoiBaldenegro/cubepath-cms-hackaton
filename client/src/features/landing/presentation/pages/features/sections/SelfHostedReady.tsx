import React from "react";
import styles from "../../LandingPage.module.css";

const SelfHostedReady = () => (
  <section className={styles.selfHostSection}>
    <div className={styles.selfHostContent}>
      <h2 className={styles.selfHostTitle}>Self-Hosted Ready ☁️</h2>
      <p className={styles.selfHostSubtitle}>
        Usa Testimo en la nube o despliega tu propia instancia para control total de datos y cumplimiento normativo.
      </p>
      <ul className={styles.selfHostList}>
        <li>Docker y Traefik listos para producción.</li>
        <li>Soporte para PostgreSQL y Supabase.</li>
      </ul>
      <p className={styles.selfHostNote}>
        <b>¿Por qué importa?</b> Ideal para empresas que requieren soberanía de datos o integración con infraestructura propia.
      </p>
    </div>
  </section>
);

export default SelfHostedReady;
