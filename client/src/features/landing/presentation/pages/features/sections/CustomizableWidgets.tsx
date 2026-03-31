import styles from '../../features/FeaturesPage.module.css';

const CustomizableWidgets = () => (
  <section className={styles.section}>
    <div className={styles.sectionContent}>
      <h2 className={styles.sectionTitle}>
        <span className={styles.sectionIcon}>✨</span>
        Widgets personalizables
      </h2>
      <p className={styles.sectionDesc}>
        Múltiples modos de visualización: grid, lista, slider, popup. 
        Filtros dinámicos, rating stars, avatars y más.
      </p>
      <div className={styles.codeBlock}>
        <pre>{`<testimo-widget 
  layout="slider"
  show-rating="true"
  show-avatar="true"
  filter-category="tech"
/>`}</pre>
      </div>
      <p className={styles.note}>
        <strong>Adapta el widget:</strong> Cada sitio es diferente. Personaliza para maximizar conversión.
      </p>
    </div>
  </section>
);

export default CustomizableWidgets;
