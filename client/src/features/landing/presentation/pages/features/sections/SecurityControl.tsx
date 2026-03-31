import styles from '../../features/FeaturesPage.module.css';


const SecurityControl = () => (
  <section className={styles.section}>
    <div className={styles.sectionContent}>
      <h2 className={styles.sectionTitle}>
        <span className={styles.sectionIcon}>🔐</span>
        Seguridad y control
      </h2>
      <p className={styles.sectionDesc}>
        Protección enterprise lista para producción. Whitelist de dominios, protección anti-spam con CAPTCHA, 
        autenticación JWT y compliance GDPR.
      </p>
      <div className={styles.codeBlock}>
        <pre>{`{
  "domain_whitelist": ["tuweb.com", "app.tuweb.com"],
  "captcha_enabled": true,
  "jwt_auth": true,
  "gdpr_compliant": true
}`}</pre>
      </div>
      <p className={styles.note}>
        <strong>Tranquilidad total:</strong> Los datos de tus clientes están protegidos con los más altos estándares de seguridad.
      </p>
    </div>
  </section>
);

export default SecurityControl;
