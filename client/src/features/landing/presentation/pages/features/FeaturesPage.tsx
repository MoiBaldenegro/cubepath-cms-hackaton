import React from "react";
import styles from "../LandingPage.module.css";
import InstantIntegration from "./sections/InstantIntegration";
import AdvancedCustomization from "./sections/AdvancedCustomization";
import SecurityControl from "./sections/SecurityControl";
import MultiPlatformSDK from "./sections/MultiPlatformSDK";
import SelfHostedReady from "./sections/SelfHostedReady";
import CustomizableWidgets from "./sections/CustomizableWidgets";
import EnterpriseSecurity from "./sections/EnterpriseSecurity";
import FastLightweight from "./sections/FastLightweight";

export const FeaturesPage = () => (
  <div className={styles.container}>
    <header className={styles.hero}>
      <h1 className={styles.title}>Características de Testimo</h1>
      <p className={styles.subtitle}>
        Descubre cómo Testimo transforma la gestión de testimonios en tu producto SaaS. Cada sección explica a fondo el valor, uso y ventajas técnicas de cada funcionalidad.
      </p>
    </header>
    <InstantIntegration />
    <AdvancedCustomization />
    <SecurityControl />
    <MultiPlatformSDK />
    <SelfHostedReady />
    <CustomizableWidgets />
    <EnterpriseSecurity />
    <FastLightweight />
  </div>
);

export default FeaturesPage;
