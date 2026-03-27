import styles from "../../LandingPage.module.css";

const AdvancedCustomization = () => (
  <section className={styles.selfHostSection}>
    <div className={styles.selfHostContent}>
      <h2 className={styles.selfHostTitle}>Personalización avanzada 🛠️</h2>
      <p className={styles.selfHostSubtitle}>
        El widget soporta modos claro/oscuro, layouts grid/list, slots y CSS variables. Personaliza la experiencia visual para que encaje perfectamente con tu marca.
      </p>
      <ul className={styles.selfHostList}>
        <li>Soporte para temas y estilos globales.</li>
        <li>Extiende el widget o crea tu propia UI sobre la API headless.</li>
      </ul>
      <p className={styles.selfHostNote}>
        <b>¿Por qué importa?</b> Aumenta la conversión y la confianza mostrando testimonios alineados con tu identidad visual.
      </p>
    </div>
  </section>
);

export default AdvancedCustomization;
