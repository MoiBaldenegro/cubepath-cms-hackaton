import { useState, useMemo } from 'react';
import { useAuth } from '../../../../shared/contexts/useAuth';
import styles from './EmbedWidget.module.css';

type Framework = 'react' | 'astro' | 'vue' | 'nuxt' | 'svelte' | 'solid' | 'angular' | 'html';

const API_URL = 'http://hackathoncubepath-server-zzxmva-37677b-108-165-47-237.traefik.me';

export const EmbedWidget = () => {
  const [integrationMethod, setIntegrationMethod] = useState<'script' | 'npm'>('npm');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [selectedFramework, setSelectedFramework] = useState<Framework>('react');

  const [copied, setCopied] = useState(false);
  const [envCopied, setEnvCopied] = useState(false);
  const [installCopied, setInstallCopied] = useState(false);

  const { user } = useAuth();
  const organizationId = user?.organizationId ?? 'TU_ORG_ID';

  const scriptSrc = `${API_URL}/widget/embed.js?organizationId=${organizationId}&theme=${theme}&layout=${layout}`;

  const frameworkConfig: Record<Framework, {
    label: string;
    variable: string;
    install: string;
    getCode: (_orgId: string, theme: string, layout: string) => string;
  }> = {
    react: {
      label: 'React (Vite)',
      variable: 'VITE_ORG_ID',
      install: 'npm install testimo-widget',
      getCode: (_orgId, theme, layout) => `import 'testimo-widget';

export function Testimonials() {
  const orgId = import.meta.env.VITE_ORG_ID;

  return (
    <testimo-widget 
      organization-id={orgId} 
      theme="${theme}" 
      layout="${layout}"
    ></testimo-widget>
  );
}`
    },
    astro: {
      label: 'Astro',
      variable: 'PUBLIC_ORG_ID',
      install: 'npm install testimo-widget',
      getCode: (_orgId, theme, layout) => `---
import 'testimo-widget';
const orgId = import.meta.env.PUBLIC_ORG_ID;
---

<testimo-widget 
  organization-id={orgId} 
  theme="${theme}" 
  layout="${layout}"
></testimo-widget>`
    },
    vue: {
      label: 'Vue (Vite)',
      variable: 'VITE_ORG_ID',
      install: 'npm install testimo-widget',
      getCode: (_orgId, theme, layout) => `<script setup>
import 'testimo-widget';
const orgId = import.meta.env.VITE_ORG_ID;
</script>

<template>
  <testimo-widget 
    :organization-id="orgId" 
    theme="${theme}" 
    layout="${layout}"
  ></testimo-widget>
</template>`
    },
    nuxt: {
      label: 'Nuxt 3',
      variable: 'NUXT_PUBLIC_ORG_ID',
      install: 'npm install testimo-widget',
      getCode: (_orgId, theme, layout) => `<!-- plugins/testimo.client.ts -->
import 'testimo-widget';

<!-- Component.vue -->
<script setup>
const config = useRuntimeConfig();
const orgId = config.public.orgId;
</script>

<template>
  <testimo-widget 
    :organization-id="orgId" 
    theme="${theme}" 
    layout="${layout}"
  ></testimo-widget>
</template>`
    },
    svelte: {
      label: 'Svelte/Kit',
      variable: 'PUBLIC_ORG_ID',
      install: 'npm install testimo-widget',
      getCode: (_orgId, theme, layout) => `<script>
  import { onMount } from 'svelte';
  import { env } from '$env/dynamic/public';

  onMount(async () => {
    await import('testimo-widget');
  });
</script>

<testimo-widget 
  organization-id={env.PUBLIC_ORG_ID} 
  theme="${theme}" 
  layout="${layout}"
></testimo-widget>`
    },
    solid: {
      label: 'SolidJS',
      variable: 'VITE_ORG_ID',
      install: 'npm install testimo-widget',
      getCode: (_orgId, theme, layout) => `import 'testimo-widget';

export default function Testimonials() {
  const orgId = import.meta.env.VITE_ORG_ID;

  return (
    <testimo-widget 
      organization-id={orgId} 
      theme="${theme}" 
      layout="${layout}"
    ></testimo-widget>
  );
}`
    },
    angular: {
      label: 'Angular',
      variable: 'NG_APP_ORG_ID',
      install: 'npm install testimo-widget',
      getCode: (_orgId, theme, layout) => `// app.module.ts
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import 'testimo-widget';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

// app.component.html
<testimo-widget 
  [attr.organization-id]="orgId" 
  theme="${theme}" 
  layout="${layout}"
></testimo-widget>`
    },
    html: {
      label: 'HTML / Buildless',
      variable: 'ORG_ID',
      install: 'npm install testimo-widget',
      getCode: (orgId, theme, layout) => `<!-- index.html -->
<script
  src="${API_URL}/widget/embed.js?organizationId=${orgId}&theme=${theme}&layout=${layout}"
  type="module"
  async>
</script>

<testimo-widget 
  organization-id="${orgId}" 
  theme="${theme}" 
  layout="${layout}"
></testimo-widget>`
    }
  };

  // Código final que se muestra (se actualiza automáticamente)
  const embedCode = useMemo(() => {
    if (integrationMethod === 'script') {
      return `<!--
Integración rápida con Testimo
El código ya está configurado con tu Organization ID
-->
<script
  src="${API_URL}/widget/embed.js?organizationId=${organizationId}&theme=${theme}&layout=${layout}"
  type="module"
  async>
</script>

<testimo-widget 
  organization-id="${organizationId}" 
  theme="${theme}" 
  layout="${layout}"
></testimo-widget>`;
    }

    // Para NPM Package
    const config = frameworkConfig[selectedFramework];
    let code = config.getCode(organizationId, theme, layout);

    // Reemplazo seguro del Organization ID
    if (organizationId !== 'TU_ORG_ID') {
      code = code.replace(/TU_ORG_ID/g, organizationId);
    }

    return code;
  }, [integrationMethod, selectedFramework, theme, layout, organizationId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleEnvCopy = () => {
    const variableName = frameworkConfig[selectedFramework].variable;
    navigator.clipboard.writeText(`${variableName}=${organizationId}`).then(() => {
      setEnvCopied(true);
      setTimeout(() => setEnvCopied(false), 2000);
    });
  };

  const handleInstallCopy = () => {
    navigator.clipboard.writeText(frameworkConfig[selectedFramework].install).then(() => {
      setInstallCopied(true);
      setTimeout(() => setInstallCopied(false), 2000);
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Integrar Widget de Testimonios</h2>
        <p className={styles.subtitle}>Selecciona tu método de integración preferido</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.controlsGrid}>
          <div className={styles.controlGroup}>
            <label className={styles.label}>Método de Integración</label>
            <div className={styles.toggleGroup}>
              <button 
                className={`${styles.toggleButton} ${integrationMethod === 'script' ? styles.active : ''}`}
                onClick={() => setIntegrationMethod('script')}
              >
                Script Tag
              </button>
              <button 
                className={`${styles.toggleButton} ${integrationMethod === 'npm' ? styles.active : ''}`}
                onClick={() => setIntegrationMethod('npm')}
              >
                NPM Package
              </button>
            </div>
          </div>

          <div className={styles.controlGroup}>
            <label className={styles.label}>Tema</label>
            <div className={styles.toggleGroup}>
              <button 
                className={`${styles.toggleButton} ${theme === 'light' ? styles.active : ''}`}
                onClick={() => setTheme('light')}
              >
                Light
              </button>
              <button 
                className={`${styles.toggleButton} ${theme === 'dark' ? styles.active : ''}`}
                onClick={() => setTheme('dark')}
              >
                Dark
              </button>
            </div>
          </div>

          <div className={styles.controlGroup}>
            <label className={styles.label}>Diseño</label>
            <div className={styles.toggleGroup}>
              <button 
                className={`${styles.toggleButton} ${layout === 'grid' ? styles.active : ''}`}
                onClick={() => setLayout('grid')}
              >
                Grid
              </button>
              <button 
                className={`${styles.toggleButton} ${layout === 'list' ? styles.active : ''}`}
                onClick={() => setLayout('list')}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {integrationMethod === 'npm' && (
          <div className={styles.controlGroup}>
            <label className={styles.label}>Seleccionar Framework</label>
            <div className={styles.frameworkGrid}>
              {(Object.keys(frameworkConfig) as Framework[]).map((fw) => (
                <button
                  key={fw}
                  className={`${styles.toggleButton} ${selectedFramework === fw ? styles.active : ''}`}
                  onClick={() => setSelectedFramework(fw)}
                >
                  {frameworkConfig[fw].label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Variable de entorno */}
      {integrationMethod === 'npm' && (
        <div className={styles.envSection}>
          <label className={styles.label}>Variable de Entorno (.env)</label>
          <div className={styles.envRow}>
            <code className={styles.envCode}>
              {frameworkConfig[selectedFramework].variable}={organizationId}
            </code>
            <button 
              className={styles.copyButton}
              onClick={handleEnvCopy}
            >
              {envCopied ? '✓ Copiado' : 'Copiar'}
            </button>
          </div>
          <p className={styles.hint}>
            Agrega esto en tu archivo <code>.env</code>
          </p>
        </div>
      )}

      {/* Comando de instalación */}
      {integrationMethod === 'npm' && (
        <div className={styles.installRow}>
          <code className={styles.installCode}>
            {frameworkConfig[selectedFramework].install}
          </code>
          <button 
            className={styles.copyButton}
            onClick={handleInstallCopy}
          >
            {installCopied ? '✓' : 'Copiar'}
          </button>
        </div>
      )}

      {/* Bloque de código */}
      <div className={styles.codeBlock}>
        <pre className={styles.codePre}>{embedCode}</pre>
        <button 
          className={`${styles.codeCopyBtn} ${copied ? styles.copied : ''}`}
          onClick={handleCopy}
        >
          {copied ? '✓ Copiado!' : 'Copiar Código'}
        </button>
      </div>

      {/* Vista previa */}
      <div className={styles.previewSection}>
        <h3 className={styles.previewTitle}>Vista Previa</h3>
        <div className={styles.previewContainer}>
          <iframe 
            key={`${theme}-${layout}-${organizationId}`}
            className={styles.previewIframe}
            srcDoc={`
              <!DOCTYPE html>
              <html>
                <head>
                  <style>body { margin: 20px; font-family: system-ui, sans-serif; }</style>
                  <script src="${scriptSrc}" type="module" async></script>
                </head>
                <body>
                  <testimo-widget organization-id="${organizationId}" theme="${theme}" layout="${layout}"></testimo-widget>
                </body>
              </html>
            `}
            title="Widget Preview"
          />
        </div>
      </div>
    </div>
  );
};