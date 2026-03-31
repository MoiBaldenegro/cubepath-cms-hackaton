import { useState } from 'react';
import styles from './EmbedWidget.module.css'; // Ajusta la ruta según tu proyecto

type Framework = 'react' | 'nextjs' | 'vue' | 'nuxt' | 'svelte' | 'solid' | 'angular' | 'html';

export const EmbedWidget = () => {
  const [integrationMethod, setIntegrationMethod] = useState<'script' | 'npm'>('npm');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [selectedFramework, setSelectedFramework] = useState<Framework>('react');
  const [copied, setCopied] = useState(false);
  const [envCopied, setEnvCopied] = useState(false);
  const [installCopied, setInstallCopied] = useState(false);

  const organizationId = import.meta.env.VITE_ORG_ID || 'YOUR_ORG_ID';
  const API_URL = import.meta.env.VITE_API_URL || '';
  // Usar siempre el endpoint real del backend para la preview y el código generado
  const scriptSrc = `${API_URL}/widget/embed.js?organizationId=${organizationId}&theme=${theme}&layout=${layout}`;

  const frameworkConfig: Record<Framework, {
    label: string;
    variable: string;
    install: string;
    code: string;
  }> = {
    react: {
      label: 'React (Vite)',
      variable: 'VITE_ORG_ID',
      install: 'npm install testimo-widget',
      code: `import 'testimo-widget';

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
    nextjs: {
      label: 'Next.js',
      variable: 'NEXT_PUBLIC_ORG_ID',
      install: 'npm install testimo-widget',
      code: `'use client';

import { useEffect, useState } from 'react';
import 'testimo-widget';

export default function Testimonials() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <testimo-widget 
      organization-id={process.env.NEXT_PUBLIC_ORG_ID} 
      theme="${theme}" 
      layout="${layout}" 
    ></testimo-widget>
  );
}`
    },
    vue: {
      label: 'Vue (Vite)',
      variable: 'VITE_ORG_ID',
      install: 'npm install testimo-widget',
      code: `<script setup>
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
      code: `<!-- plugin/testimo.client.ts -->
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
      code: `<script>
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
      code: `import 'testimo-widget';
import { createSignal } from 'solid-js';

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
      code: `// app.module.ts
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import 'testimo-widget';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // ...
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
      code: `<!-- index.html -->
<script type="module">
  import 'testimo-widget';
</script>

<testimo-widget 
  organization-id="YOUR_ORG_ID" 
  theme="${theme}" 
  layout="${layout}"
></testimo-widget>`
    }
  };

  let embedCode = '';

  if (integrationMethod === 'script') {
    embedCode = `<!--
INTEGRACIÓN RÁPIDA (solo <script>):
El widget se monta automáticamente antes del <script>.
Debes poner tu organizationId en la URL del script.
Si quieres controlar el lugar exacto, pon <testimo-widget></testimo-widget> donde quieras el widget.
Ambos modos funcionan.
-->
<script
  src="${API_URL}/widget/embed.js?organizationId=${organizationId}&theme=${theme}&layout=${layout}"
  type="module"
  async>
</script>

<!-- Opción avanzada: usa el tag personalizado para controlar el lugar -->
<testimo-widget></testimo-widget>`;
  } else {
    embedCode = frameworkConfig[selectedFramework].code;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEnvCopy = () => {
    const variableName = frameworkConfig[selectedFramework].variable;
    navigator.clipboard.writeText(`${variableName}=${organizationId}`);
    setEnvCopied(true);
    setTimeout(() => setEnvCopied(false), 2000);
  };

  const handleInstallCopy = () => {
    navigator.clipboard.writeText(frameworkConfig[selectedFramework].install);
    setInstallCopied(true);
    setTimeout(() => setInstallCopied(false), 2000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Embed Your Testimonials</h2>
        <p className={styles.subtitle}>Choose your preferred integration method.</p>
      </div>

      <div className={styles.controls}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
          {/* Integration Method */}
          <div className={styles.controlGroup}>
            <label className={styles.label}>Integration Method</label>
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

          {/* Theme */}
          <div className={styles.controlGroup}>
            <label className={styles.label}>Theme</label>
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

          {/* Layout */}
          <div className={styles.controlGroup}>
            <label className={styles.label}>Layout</label>
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

        {/* Framework selector */}
        {integrationMethod === 'npm' && (
          <div className={styles.controlGroup} style={{ marginTop: '16px' }}>
            <label className={styles.label}>Select Framework</label>
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

      {/* Environment Variable */}
      {integrationMethod === 'npm' && (
        <div className={styles.envSection}>
          <label className={styles.label}>Environment Variable (.env)</label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <code style={{ 
              flex: 1, 
              padding: '12px', 
              background: '#fff', 
              border: '1px solid #ddd', 
              borderRadius: '6px', 
              fontFamily: 'monospace',
              overflowX: 'auto'
            }}>
              {frameworkConfig[selectedFramework].variable}={organizationId}
            </code>
            <button 
              className={styles.copyButton}
              onClick={handleEnvCopy}
            >
              {envCopied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <p style={{ fontSize: '13px', color: '#666', marginTop: '6px' }}>
            Agrega esto en tu archivo <code>.env</code>
          </p>
        </div>
      )}

      {/* Install command */}
      {integrationMethod === 'npm' && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '12px 16px', 
          background: 'rgba(0,0,0,0.03)', 
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          <code style={{ fontFamily: 'monospace', fontSize: '14px' }}>
            {frameworkConfig[selectedFramework].install}
          </code>
          <button 
            className={styles.copyButton}
            onClick={handleInstallCopy}
          >
            {installCopied ? '✓' : 'Copy'}
          </button>
        </div>
      )}

      {/* Code Block */}
      <div className={styles.codeBlock}>
        <div style={{ position: 'relative' }}>
          <pre style={{ 
            background: '#23272f',
            color: '#f8fafc',
            padding: '20px', 
            borderRadius: '8px', 
            overflow: 'auto',
            fontSize: '14px',
            lineHeight: '1.5',
            border: '1px solid #222',
          }}>
            {embedCode}
          </pre>
          <button 
            className={`${styles.copyButton} ${copied ? styles.copied : ''}`}
            onClick={handleCopy}
            style={{ position: 'absolute', top: '12px', right: '12px' }}
          >
            {copied ? '✓ Copied!' : 'Copy Code'}
          </button>
        </div>
      </div>

      {/* Live Preview */}
      <div className={styles.previewSection}>
        <h3 className={styles.previewTitle}>Vista Previa</h3>
        <div className={styles.previewContainer}>
          <iframe 
            key={`${theme}-${layout}-${integrationMethod}-${selectedFramework}`}
            srcDoc={`
              <!DOCTYPE html>
              <html>
                <head>
                  <style>body { margin: 20px; font-family: system-ui, sans-serif; }</style>
                  ${integrationMethod === 'npm' 
                    ? `<script type="module" src="${API_URL}/widget/sdk.js"></script>` 
                    : ''}
                </head>
                <body>
                  ${integrationMethod === 'script'
                    ? `<script src="${scriptSrc}" type="module" async></script>\n<testimo-widget organization-id=\"${organizationId}\" theme=\"${theme}\" layout=\"${layout}\"></testimo-widget>`
                    : ''}
                </body>
              </html>
            `}
            title="Widget Preview"
            style={{ 
              width: '100%', 
              height: '420px', 
              border: '1px solid #ddd',
              borderRadius: '8px',
              background: '#fff'
            }}
          />
        </div>
      </div>
    </div>
  );
};