import styles from '../../features/FeaturesPage.module.css';


const SelfHostedReady = () => (
  <section className={styles.section}>
    <div className={styles.sectionContent}>
      <h2 className={styles.sectionTitle}>
        <span className={styles.sectionIcon}>🖥️</span>
        Autohospedaje listo
      </h2>
      <p className={styles.sectionDesc}>
        Ejecuta tu propia instancia de Testimo. Docker Compose incluido, base de datos propia, 
        zero vendor lock-in.
      </p>
      <div className={styles.codeBlock}>
        <pre>{`# Levanta todo en segundos
docker-compose up -d

# Configura tu API
TESTIMO_API_URL=https://api.tu-dominio.com
DATABASE_URL=postgres://...`}</pre>
      </div>
      <p className={styles.note}>
        <strong>Control total:</strong> Tu infraestructura, tus reglas, tus datos. Sin intermediarios.
      </p>
    </div>
  </section>
);

export default SelfHostedReady;
