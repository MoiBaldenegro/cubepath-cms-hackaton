import React from "react";
import styles from "../../LandingPage.module.css";

const InstantIntegration = () => (
  <section className={styles.selfHostSection}>
    <div className={styles.selfHostContent}>
      <h2 className={styles.selfHostTitle}>Integración instantánea ⚡</h2>
      <p className={styles.selfHostSubtitle}>
        Instala el SDK y embebe el widget en segundos en cualquier stack: React, Vue, Angular, Next.js o Vanilla JS. Solo importa el web component y comienza a recolectar testimonios sin fricción.
      </p>
      <pre className={styles.selfHostCodeBlock}>
        {`<script src="https://cdn.testimo.app/sdk.js"></script>\n<cubepath-widget organization-id="YOUR_ORG_ID"></cubepath-widget>`
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")}
      </pre>
      <p className={styles.selfHostNote}>
        <b>¿Por qué importa?</b> Reduce el time-to-market y permite a equipos técnicos y de marketing lanzar pruebas A/B o campañas de social proof en minutos.
      </p>
    </div>
  </section>
);

export default InstantIntegration;
