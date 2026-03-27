import styles from "../../LandingPage.module.css";

const EnterpriseSecurity = () => (
  <section className={styles.selfHostSection}>
    <div className={styles.selfHostContent}>
      <h2 className={styles.selfHostTitle}>Enterprise Security 🛡️</h2>
      <p className={styles.selfHostSubtitle}>
        Funcionalidades avanzadas de seguridad: whitelisting de dominios, protección anti-spam y autenticación robusta.
      </p>
      <ul className={styles.selfHostList}>
        <li>Endpoints protegidos y roles de usuario.</li>
        <li>Auditoría y trazabilidad de cambios.</li>
      </ul>
      <p className={styles.selfHostNote}>
        <b>¿Por qué importa?</b> Tranquilidad para equipos de IT y compliance.
      </p>
    </div>
  </section>
);

export default EnterpriseSecurity;
