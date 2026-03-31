import styles from '../../features/FeaturesPage.module.css';

const EnterpriseSecurity = () => (
  <section className={styles.section}>
    <div className={styles.sectionContent}>
      <h2 className={styles.sectionTitle}>
        <span className={styles.sectionIcon}>🏢</span>
        Seguridad enterprise
      </h2>
      <p className={styles.sectionDesc}>
        Para equipos que necesitan cumplimiento normativo: SSO/SAML, auditoría completa, 
        roles granulares y políticas de retención de datos.
      </p>
      <div className={styles.codeBlock}>
        <pre>{`# SSO con SAML 2.0
SAML_PROVIDER=okta
SAML_METADATA_URL=https://okta.com/metadata

# Auditoría
AUDIT_LOG_ENABLED=true
AUDIT_LOG_RETENTION_DAYS=365`}</pre>
      </div>
      <p className={styles.note}>
        <strong>Enterprise ready:</strong> Diseñado para cumplir con los requisitos más exigentes.
      </p>
    </div>
  </section>
);

export default EnterpriseSecurity;
