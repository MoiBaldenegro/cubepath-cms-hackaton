
import { useState } from 'react';
import styles from './EmbedWidget.module.css';
import { useAuth } from '../../../../shared/contexts/AuthContext';
import { config } from '../../../../shared/infrastructure/config';


type Framework = 'react' | 'vue' | 'angular' | 'nextjs' | 'svelte' | 'solid' | 'astro' | 'remix' | 'nuxt' | 'html' | 'tanstack';

export const EmbedWidget = () => {
    const { user } = useAuth();
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [layout, setLayout] = useState<'grid' | 'list'>('grid');
    const [integrationMethod, setIntegrationMethod] = useState<'script' | 'npm'>('script');
    const [selectedFramework, setSelectedFramework] = useState<Framework>('react');
    const [copied, setCopied] = useState(false);
    const [envCopied, setEnvCopied] = useState(false);
    const [installCopied, setInstallCopied] = useState(false);

    if (!user) return null;

    // Use organizationId from user object, fallback to 'demo-org-id' if missing for preview
    const organizationId = user.organizationId || 'current-user-org-id';
    
    // Construct the script URL based on selected options
    const API_URL = config.VITE_API_URL;
    const scriptSrc = `${API_URL}/widget/embed.js?organizationId=${organizationId}&theme=${theme}&layout=${layout}`;
    
    const frameworkConfig: Record<Framework, { label: string; variable: string; install: string; code: string }> = {
        tanstack: {
            label: 'TanStack Start',
            variable: 'VITE_ORG_ID',
            install: 'npm install @cubepath/widget',
            code: `// 1. app/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import '@cubepath/widget';

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  const orgId = import.meta.env.VITE_ORG_ID;

  return (
    <cubepath-widget 
      organization-id={orgId} 
      theme="${theme}" 
      layout="${layout}" 
    ></cubepath-widget>
  )
}`
        },
        react: {
            label: 'React (Vite)',
            variable: 'VITE_ORG_ID',
            install: 'npm install @cubepath/widget',
            code: `// 1. main.tsx or App.tsx
import '@cubepath/widget';

// 2. Component usage
export function Testimonials() {
  const orgId = import.meta.env.VITE_ORG_ID;

  return (
    <cubepath-widget 
      organization-id={orgId} 
      theme="${theme}" 
      layout="${layout}"
    ></cubepath-widget>
  );
}`
        },
        nextjs: {
            label: 'Next.js',
            variable: 'NEXT_PUBLIC_ORG_ID',
            install: 'npm install @cubepath/widget',
            code: `// 1. Create a Client Component (e.g. Testimonials.tsx)
'use client';

import { useEffect, useState } from 'react';
import '@cubepath/widget';

export default function Testimonials() {
  const [mounted, setMounted] = useState(false);
  
  // Ensure custom element is only used on client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <cubepath-widget 
      organization-id={process.env.NEXT_PUBLIC_ORG_ID} 
      theme="${theme}" 
      layout="${layout}" 
    ></cubepath-widget>
  );
}`
        },
        vue: {
            label: 'Vue (Vite)',
            variable: 'VITE_ORG_ID',
            install: 'npm install @cubepath/widget',
            code: `<!-- 1. Component.vue -->
<script setup>
import '@cubepath/widget';
const orgId = import.meta.env.VITE_ORG_ID;
</script>

<template>
  <cubepath-widget 
    :organization-id="orgId" 
    theme="${theme}" 
    layout="${layout}"
  ></cubepath-widget>
</template>`
        },
        nuxt: {
            label: 'Nuxt 3',
            variable: 'NUXT_PUBLIC_ORG_ID',
            install: 'npm install @cubepath/widget',
            code: `<!-- 1. plugin/cubepath.client.ts -->
import '@cubepath/widget';
export default defineNuxtPlugin(() => {});

<!-- 2. Component.vue -->
<script setup>
const config = useRuntimeConfig();
const orgId = config.public.orgId;
</script>

<template>
  <cubepath-widget 
    :organization-id="orgId" 
    theme="${theme}" 
    layout="${layout}"
  ></cubepath-widget>
</template>`
        },
        svelte: {
            label: 'Svelte/Kit',
            variable: 'PUBLIC_ORG_ID',
            install: 'npm install @cubepath/widget',
            code: `<!-- 1. +page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { env } from '$env/dynamic/public';
  
  onMount(async () => {
    await import('@cubepath/widget');
  });
</script>

<cubepath-widget 
  organization-id={env.PUBLIC_ORG_ID} 
  theme="${theme}" 
  layout="${layout}"
></cubepath-widget>`
        },
        solid: {
            label: 'SolidJS',
            variable: 'VITE_ORG_ID',
            install: 'npm install @cubepath/widget',
            code: `// 1. Component.tsx
import { onMount } from 'solid-js';
import '@cubepath/widget';

export default function Testimonials() {
  const orgId = import.meta.env.VITE_ORG_ID;

  return (
    <cubepath-widget 
      organization-id={orgId} 
      theme="${theme}" 
      layout="${layout}"
    ></cubepath-widget>
  );
}`
        },
        astro: {
            label: 'Astro',
            variable: 'PUBLIC_ORG_ID',
            install: 'npm install @cubepath/widget',
            code: `---
// 1. Component.astro
---
<script>
  import '@cubepath/widget';
</script>

<cubepath-widget 
  organization-id={import.meta.env.PUBLIC_ORG_ID} 
  theme="${theme}" 
  layout="${layout}"
></cubepath-widget>`
        },
        remix: {
            label: 'Remix',
            variable: 'VITE_ORG_ID',
            install: 'npm install @cubepath/widget',
            code: `// 1. entry.client.tsx or route file
import { ClientOnly } from "remix-utils/client-only";
import '@cubepath/widget';

export default function Route() {
  return (
    <ClientOnly fallback={<div>Loading...</div>}>
      {() => (
        <cubepath-widget 
          organization-id={import.meta.env.VITE_ORG_ID} 
          theme="${theme}" 
          layout="${layout}"
        ></cubepath-widget>
      )}
    </ClientOnly>
  );
}`
        },
        angular: {
            label: 'Angular',
            variable: 'NG_APP_ORG_ID',
            install: 'npm install @cubepath/widget',
            code: `// 1. app.module.ts
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@cubepath/widget';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // ...
})

// 2. app.component.html
// Ensure 'orgId' is defined in your environment/component
<cubepath-widget 
  [attr.organization-id]="orgId" 
  theme="${theme}" 
  layout="${layout}"
></cubepath-widget>`
        },
        html: {
            label: 'HTML/Buildless',
            variable: 'ORG_ID',
            install: 'npm install @cubepath/widget',
            code: `<!-- 1. index.html -->
<script type="module">
  import '@cubepath/widget';
</script>

<cubepath-widget 
  organization-id="YOUR_ORG_ID" 
  theme="${theme}" 
  layout="${layout}"
></cubepath-widget>`
        }
    };

    let embedCode = '';
    
    if (integrationMethod === 'script') {
        embedCode = `<!-- Embed via Script Tag -->
<script 
  src="${scriptSrc}" 
  type="module"
  async>
</script>`;
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
                                NPM
                            </button>
                        </div>
                    </div>

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

                {integrationMethod === 'npm' && (
                    <div className={styles.controlGroup} style={{ marginTop: '12px' }}>
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

            {integrationMethod === 'npm' && (
                <div className={styles.envSection} style={{ marginBottom: '20px', padding: '16px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #eee' }}>
                    <label className={styles.label} style={{ marginBottom: '8px', display: 'block' }}>Environment Variable (.env)</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <code style={{ flex: 1, padding: '10px', background: '#fff', border: '1px solid #ddd', borderRadius: '4px', fontFamily: 'monospace' }}>
                            {frameworkConfig[selectedFramework].variable}={organizationId}
                        </code>
                        <button 
                            className={styles.copyButton}
                            onClick={handleEnvCopy}
                            style={{ width: 'auto', padding: '0 20px' }}
                        >
                            {envCopied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                        Add this to your project's <code>.env</code> file.
                    </p>
                </div>
            )}

            <div className={styles.codeBlock}>
                {integrationMethod === 'npm' && (
                    <div className={styles.installRow} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <code style={{ fontFamily: 'SFMono-Regular, Consolas, monospace', color: '#e1e4e8', fontSize: '13px' }}>
                            <span style={{ color: '#6a737d', marginRight: '8px' }}>$</span>
                            {frameworkConfig[selectedFramework].install}
                        </code>
                        <button 
                            className={`${styles.copyButton} ${installCopied ? styles.copied : ''}`}
                            onClick={handleInstallCopy}
                            style={{ position: 'static', padding: '4px 10px', fontSize: '12px', margin: 0 }}
                        >
                            {installCopied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                )}
                <div style={{ position: 'relative' }}>
                    <pre>{embedCode}</pre>
                    <button 
                        className={`${styles.copyButton} ${copied ? styles.copied : ''}`}
                        onClick={handleCopy}
                        style={{ top: 0, right: 0 }}
                    >
                        {copied ? 'Copied!' : 'Copy Code'}
                    </button>
                </div>
            </div>

            <div className={styles.previewSection}>
                <h3 className={styles.previewTitle}>Live Preview</h3>
                <div className={styles.previewContainer}>
                    <iframe 
                        key={`${theme}-${layout}-${integrationMethod}`} 
                        srcDoc={`
                            <html>
                            <head>
                                <style>body { margin: 0; font-family: sans-serif; }</style>
                                ${integrationMethod === 'npm' 
                                    ? `<script type="module" src="http://localhost:3000/widget/sdk.js"></script>`
                                    : ''
                                }
                            </head>
                            <body>
                                ${integrationMethod === 'script'
                                    ? `<script src="${scriptSrc}" type="module"></script>`
                                    : `<cubepath-widget 
                                        organization-id="${organizationId}" 
                                        theme="${theme}" 
                                        layout="${layout}" 
                                       ></cubepath-widget>`
                                }
                            </body>
                            </html>
                        `}
                        title="Widget Preview"
                        className={styles.previewFrame}
                        style={{ height: '400px', width: '100%', border: 'none' }}
                    />
                </div>
            </div>
        </div>
    );
};
