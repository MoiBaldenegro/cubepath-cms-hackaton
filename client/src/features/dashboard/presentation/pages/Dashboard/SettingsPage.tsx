import { useState } from 'react';
import { useAuth } from '../../../../../shared/contexts/useAuth';
import styles from './SettingsPage.module.css';

const API_URL = 'http://hackathoncubepath-server-zzxmva-37677b-108-165-47-237.traefik.me';

export const SettingsPage = () => {
  const { user } = useAuth();
  const [copiedOrgId, setCopiedOrgId] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedWidget, setCopiedWidget] = useState(false);

  const handleCopyOrgId = () => {
    if (user?.organizationId) {
      navigator.clipboard.writeText(user.organizationId);
      setCopiedOrgId(true);
      setTimeout(() => setCopiedOrgId(false), 2000);
    }
  };

  const handleCopyScript = () => {
    const script = `<script src="${API_URL}/widget/embed.js?organizationId=${user?.organizationId}" type="module" async></script>`;
    navigator.clipboard.writeText(script);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleCopyWidget = () => {
    const widget = `<testimo-widget organization-id="${user?.organizationId}" theme="light" layout="grid"></testimo-widget>`;
    navigator.clipboard.writeText(widget);
    setCopiedWidget(true);
    setTimeout(() => setCopiedWidget(false), 2000);
  };

  const fullScript = `<script src="${API_URL}/widget/embed.js?organizationId=${user?.organizationId}" type="module" async></script>\n\n<testimo-widget organization-id="${user?.organizationId}" theme="light" layout="grid"></testimo-widget>`;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>🔑</div>
        <div className={styles.headerInfo}>
          <h3>Configuración de Integración</h3>
          <p>Usa estos datos para integrar el widget en tu sitio web</p>
        </div>
      </div>

      <div className={styles.apiKeysSection}>
        <h4 className={styles.sectionTitle}>Tu Organization ID</h4>
        
        <div className={styles.keyCard}>
          <div className={styles.keyHeader}>
            <div className={styles.keyLabel}>
              <span className={styles.keyIcon}>🏢</span>
              <span className={styles.keyName}>Organization ID</span>
            </div>
            <span className={styles.keyBadge}>Activo</span>
          </div>
          
          <div className={styles.keyValueContainer}>
            <code className={styles.keyValue}>
              {user?.organizationId || 'No disponible'}
            </code>
            <button 
              className={`${styles.copyButton} ${copiedOrgId ? styles.copied : ''}`}
              onClick={handleCopyOrgId}
            >
              {copiedOrgId ? '✓ Copiado' : '📋 Copiar'}
            </button>
          </div>

          <div className={styles.keyDescription}>
            <strong>¿Qué es esto?</strong><br />
            Tu Organization ID es único y identifica tu cuenta. Úsalo en el widget para mostrar tus testimonios.
          </div>
        </div>
      </div>

      <div className={styles.apiKeysSection}>
        <h4 className={styles.sectionTitle}>Código de Integración</h4>
        <p className={styles.subtitle}>
          Copia y pega este código en tu sitio web. Ya está configurado con tu Organization ID y nuestro servidor.
        </p>
        
        <div className={styles.keyCard}>
          <div className={styles.keyHeader}>
            <span className={styles.sectionHeader}>
              Script + Widget
            </span>
            <button 
              className={`${styles.copyButton} ${copiedScript ? styles.copied : ''}`}
              onClick={handleCopyScript}
            >
              {copiedScript ? '✓ Copiado' : '📋 Copiar todo'}
            </button>
          </div>
          
          <div className={styles.codeBlock}>
            <pre>
              {fullScript}
            </pre>
          </div>
        </div>

        <div className={styles.scriptGrid}>
          <div className={styles.keyCard}>
            <div className={styles.keyHeader}>
              <span className={styles.sectionHeaderSmall}>
                Solo Script
              </span>
            </div>
            <div className={styles.codeBlockSmall}>
              <pre>
                {`<script src="${API_URL}/widget/embed.js?organizationId=${user?.organizationId}" type="module" async></script>`}
              </pre>
            </div>
          </div>

          <div className={styles.keyCard}>
            <div className={styles.keyHeader}>
              <span className={styles.sectionHeaderSmall}>
                Solo Widget
              </span>
              <button 
                className={`${styles.copyButton} ${styles.smallCopyBtn} ${copiedWidget ? styles.copied : ''}`}
                onClick={handleCopyWidget}
              >
                {copiedWidget ? '✓' : '📋'}
              </button>
            </div>
            <div className={styles.codeBlockSmall}>
              <pre>
                {`<testimo-widget organization-id="${user?.organizationId}" theme="light" layout="grid"></testimo-widget>`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.apiKeysSection}>
        <h4 className={styles.sectionTitle}>Opciones del Widget</h4>
        
        <div className={styles.widgetOptionsSection}>
          <div className={styles.usageGrid}>
            <div className={styles.usageItem}>
              <div className={styles.usageValue}>theme</div>
              <div className={styles.usageLabel}>"light" | "dark"</div>
            </div>
            <div className={styles.usageItem}>
              <div className={styles.usageValue}>layout</div>
              <div className={styles.usageLabel}>"grid" | "list"</div>
            </div>
            <div className={styles.usageItem}>
              <div className={styles.usageValue}>max-items</div>
              <div className={styles.usageLabel}>número</div>
            </div>
            <div className={styles.usageItem}>
              <div className={styles.usageValue}>mode</div>
              <div className={styles.usageLabel}>"display" | "collect"</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.apiKeysSection}>
        <h4 className={styles.sectionTitle}>Endpoint de la API</h4>
        <div className={styles.keyCard}>
          <div className={styles.apiUrlContainer}>
            <div className={styles.apiUrlLabel}>URL del servidor:</div>
            <code className={styles.apiUrlCode}>
              {API_URL}
            </code>
          </div>
        </div>
      </div>

      <div className={styles.dangerZone}>
        <div className={styles.dangerHeader}>
          <span className={styles.dangerIcon}>⚠️</span>
          <span className={styles.dangerTitle}>Zona de Peligro</span>
        </div>
        <p className={styles.dangerDescription}>
          Regenerar tu Organization ID invalidará todas las integraciones existentes. 
          Asegúrate de actualizar tus aplicaciones después de realizar este cambio.
        </p>
        <button className={styles.regenerateButton}>
          🔄 Regenerar Organization ID
        </button>
      </div>
    </div>
  );
};
