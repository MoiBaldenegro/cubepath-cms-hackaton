import React from "react";
import styles from "../../LandingPage.module.css";

const FastLightweight = () => (
  <section className={styles.selfHostSection}>
    <div className={styles.selfHostContent}>
      <h2 className={styles.selfHostTitle}>Fast & Lightweight 🚀</h2>
      <p className={styles.selfHostSubtitle}>
        SDK y widget ultra-ligeros (&lt; 10kb gzipped), sin dependencias externas. Carga instantánea y rendimiento óptimo en cualquier dispositivo.
      </p>
      <p className={styles.selfHostNote}>
        <b>¿Por qué importa?</b> Mejora el SEO, la experiencia de usuario y la conversión.
      </p>
    </div>
  </section>
);

export default FastLightweight;
