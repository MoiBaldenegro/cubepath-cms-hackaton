import styles from "../../LandingPage.module.css";

const SecurityControl = () => (
  <section className={styles.selfHostSection}>
    <div className={styles.selfHostContent}>
      <h2 className={styles.selfHostTitle}>Seguridad y control 🔐</h2>
      <p className={styles.selfHostSubtitle}>
        Whitelist de dominios, protección anti-spam, autenticación JWT y cumplimiento para empresas. Tus datos y los de tus usuarios siempre protegidos.
      </p>
      <ul className={styles.selfHostList}>
        <li>Controla desde qué dominios se pueden enviar testimonios.</li>
        <li>Filtros anti-spam y validaciones avanzadas.</li>
        <li>Autenticación JWT para endpoints sensibles.</li>
      </ul>
      <p className={styles.selfHostNote}>
        <b>¿Por qué importa?</b> Cumple requisitos de seguridad y privacidad para clientes enterprise y sectores regulados.
      </p>
    </div>
  </section>
);

export default SecurityControl;
