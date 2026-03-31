import { useState } from 'react';
import styles from './Dashboard.module.css';
import { useAuth } from '../../../../../shared/contexts/useAuth';
import { UserRole } from '../../../../users/domain/UserRole';
import { CreateTestimonialForm } from '../../../../testimonials/presentation/components/CreateTestimonialForm';
import { TestimonialList } from '../../../../testimonials/presentation/components/TestimonialList';
import { UserList } from '../../../../users/presentation/components/UserList';
import { useNavigate } from 'react-router-dom';
import { EmbedWidget } from '../../../../widget/presentation/components/EmbedWidget';
import { AnalyticsWidget } from '../../components/AnalyticsWidget';
import { SettingsPage } from './SettingsPage';

const TestimoLogo = () => (
  <svg width="28" height="28" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="notif_grad_dash" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38bdf8"/>
        <stop offset="100%" stopColor="#2563eb"/> 
      </linearGradient>
      <mask id="cutout-mask-dash">
        <rect width="100%" height="100%" fill="white"/>
        <circle cx="416" cy="112" r="80" fill="black"/>
      </mask>
    </defs>
    <rect x="64" y="80" width="384" height="160" rx="80" fill="#18181B"/>
    <rect x="176" y="208" width="160" height="256" rx="80" fill="#18181B"/>
    <circle cx="416" cy="112" r="80" fill="#18181B"/>
    <rect x="96" y="112" width="320" height="96" rx="48" fill="white" mask="url(#cutout-mask-dash)"/>
    <rect x="208" y="240" width="96" height="192" rx="48" fill="white"/>
    <circle cx="416" cy="112" r="48" fill="url(#notif_grad_dash)"/>
  </svg>
);

const viewTitles: Record<string, string> = {
  overview: 'Panel General',
  testimonials: 'Testimonios',
  'create-testimonial': 'Crear Testimonio',
  embed: 'Integrar Widget',
  users: 'Gestión de Usuarios',
  settings: 'Configuración',
};

export const Dashboard = () => {
  const { user, logout, isLoading } = useAuth();
  const [activeView, setActiveView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <span className={styles.loadingText}>Cargando...</span>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const isAdmin = user.role === UserRole.ADMIN;
  const isEditor = user.role === UserRole.EDITOR;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.dashboard}>
      {sidebarOpen && (
        <div className={styles.sidebarOverlay} onClick={() => setSidebarOpen(false)} />
      )}
      
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className={styles.logoSection}>
          <div className={styles.logoIcon}>
            <TestimoLogo />
          </div>
          <span className={styles.logoText}>Testimo</span>
        </div>

        <div className={styles.userSection}>
          <div className={styles.userEmail}>{user.email}</div>
          <div className={styles.roleBadge}>
            <span className={styles.roleDot}></span>
            {user.role === UserRole.ADMIN ? 'Administrador' : user.role === UserRole.EDITOR ? 'Editor' : 'Usuario'}
          </div>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navSection}>
            <div className={styles.navSectionLabel}>Menú</div>
            <button
              className={`${styles.navItem} ${activeView === 'overview' ? styles.active : ''}`}
              onClick={() => setActiveView('overview')}
            >
              <span className={styles.navIcon}>📊</span>
              Resumen
            </button>
            <button
              className={`${styles.navItem} ${activeView === 'testimonials' ? styles.active : ''}`}
              onClick={() => setActiveView('testimonials')}
            >
              <span className={styles.navIcon}>💬</span>
              Testimonios
            </button>
            {(isAdmin || isEditor) && (
              <button
                className={`${styles.navItem} ${activeView === 'create-testimonial' ? styles.active : ''}`}
                onClick={() => setActiveView('create-testimonial')}
              >
                <span className={styles.navIcon}>➕</span>
                Agregar Testimonio
              </button>
            )}
            <button
              className={`${styles.navItem} ${activeView === 'embed' ? styles.active : ''}`}
              onClick={() => setActiveView('embed')}
            >
              <span className={styles.navIcon}>🔗</span>
              Integrar Widget
            </button>
          </div>

          <div className={styles.navSection}>
            <div className={styles.navSectionLabel}>Cuenta</div>
            <button
              className={`${styles.navItem} ${activeView === 'settings' ? styles.active : ''}`}
              onClick={() => setActiveView('settings')}
            >
              <span className={styles.navIcon}>⚙️</span>
              Configuración
            </button>
          </div>

          {isAdmin && (
            <div className={styles.navSection}>
              <div className={styles.navSectionLabel}>Administración</div>
              <button
                className={`${styles.navItem} ${activeView === 'users' ? styles.active : ''}`}
                onClick={() => setActiveView('users')}
              >
                <span className={styles.navIcon}>👥</span>
                Usuarios
              </button>
            </div>
          )}

          <div className={styles.navDivider}></div>

          <button className={`${styles.navItem} ${styles.logoutItem}`} onClick={handleLogout}>
            <span className={styles.navIcon}>🚪</span>
            Cerrar Sesión
          </button>
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <button className={styles.mobileMenuBtn} onClick={() => setSidebarOpen(true)}>
            ☰
          </button>
          <h1 className={styles.headerTitle}>{viewTitles[activeView] || 'Dashboard'}</h1>
          <div className={styles.headerActions}>
            <span style={{ fontSize: '0.875rem', color: 'var(--foreground-tertiary)' }}>
              {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
          </div>
        </header>

        <div className={styles.content}>
          {activeView === 'overview' && (
            <>
              <div className={styles.card}>
                <AnalyticsWidget organizationId={user.organizationId} />
              </div>
              <div className={styles.card}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  ¡Bienvenido, {user.email}!
                </h3>
                <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.9375rem' }}>
                  Selecciona una opción del menú para gestionar tu contenido.
                </p>
              </div>
            </>
          )}

          {activeView === 'testimonials' && (
            <div className={styles.card}>
              <TestimonialList isAdmin={isAdmin} />
            </div>
          )}

          {activeView === 'create-testimonial' && (
            <div className={styles.card}>
              <CreateTestimonialForm onSuccess={() => setActiveView('testimonials')} />
            </div>
          )}

          {activeView === 'embed' && (
            <div className={styles.card}>
              <EmbedWidget />
            </div>
          )}

          {activeView === 'settings' && (
            <div className={styles.card}>
              <SettingsPage />
            </div>
          )}

          {activeView === 'users' && isAdmin && (
            <div className={styles.card}>
              <UserList />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
