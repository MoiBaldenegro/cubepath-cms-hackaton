import styles from "../../LandingPage.module.css";

const CustomizableWidgets = () => (
  <section className={styles.selfHostSection}>
    <div className={styles.selfHostContent}>
      <h2 className={styles.selfHostTitle}>Customizable Widgets 💡</h2>
      <p className={styles.selfHostSubtitle}>
        Elige entre grid, list, dark/light mode y personaliza con CSS. Adapta el widget a cualquier landing, dashboard o ecommerce.
      </p>
      <pre className={styles.selfHostCodeBlock}>{`<cubepath-widget layout="grid" theme="dark" />`}</pre>
      <p className={styles.selfHostNote}>
        <b>¿Por qué importa?</b> Flexibilidad máxima para mostrar social proof donde más impacta.
      </p>
    </div>
  </section>
);

export default CustomizableWidgets;
