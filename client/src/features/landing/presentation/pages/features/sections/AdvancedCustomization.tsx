import styles from '../../features/FeaturesPage.module.css';


const AdvancedCustomization = () => (
  <section className={styles.section}>
    <div className={styles.sectionContent}>
      <h2 className={styles.sectionTitle}>
        <span className={styles.sectionIcon}>🎨</span>
        Personalización avanzada
      </h2>
      <p className={styles.sectionDesc}>
        Tienes control total sobre la apariencia y comportamiento del widget. 
        Modos claro/oscuro, múltiples layouts, CSS variables personalizadas y slots para contenido dinámico.
      </p>
      <div className={styles.codeBlock}>
        <pre>{`<testimo-widget 
  theme="dark"
  layout="grid"
  primary-color="#6366f1"
></testimo-widget>`}</pre>
      </div>
      <p className={styles.note}>
        <strong>Flexibilidad total:</strong> Usa los presets o crea tu propia experiencia 
        modificando las CSS variables del widget.
      </p>
    </div>
  </section>
);

export default AdvancedCustomization;
