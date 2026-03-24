import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './LandingPage.module.css';
import { useAuth } from '../../../../shared/contexts/AuthContext';

export const LandingPage = () => {
    const { loginAsDemo } = useAuth();
    const navigate = useNavigate();

    const handleDemo = (e: React.MouseEvent) => {
        e.preventDefault();
        loginAsDemo();
        navigate('/dashboard');
    };

    return (
        <div className={styles.container}>
            {/* Navbar */}
            <nav className={styles.navbar}>
                <Link to="/" className={styles.logo}>
                    <img src="/testimo-logo.svg" alt="Testimo Logo" style={{ width: '40px', height: '40px', marginRight: '10px' }} /> Testimo
                </Link>
                
                <div className={styles.navLinks}>
                    <Link to="/features" className={styles.navLink}>Características</Link>
                    <Link to="/pricing" className={styles.navLink}>Precios</Link>
                    <Link to="/docs" className={styles.navLink}>Documentación</Link>
                </div>

                <div className={styles.authButtons}>
                    <Link to="/login" className={styles.loginBtn}>Iniciar sesión</Link>
                    <Link to="/register" className={styles.navCta}>Comenzar</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className={styles.hero}>
                <span className={styles.heroBadge}>Nuevo: Widgets de Testimonios Interactivos</span>
                <h1 className={styles.title}>
                    Convierte feedback en <br />
                    <span style={{color: '#007bff'}}>crecimiento para tu producto</span>
                </h1>
                <p className={styles.subtitle}>
                    API y SDK para recolectar, gestionar y desplegar testimonios en cualquier stack. Widgets web, integración headless y control total para equipos técnicos.
                </p>
                <div className={styles.ctaGroup}>
                    <Link to="/register" className={styles.primaryCta}>Probar gratis</Link>
                    <a href="#" onClick={handleDemo} className={styles.secondaryCta}>Ver demo interactiva</a>
                </div>
            </header>

            {/* Features Grid */}
            <section className={styles.features}>
                <div className={styles.featureCard}>
                    <span className={styles.featureIcon}>⚡</span>
                    <h3 className={styles.featureTitle}>Integración instantánea</h3>
                    <p className={styles.featureDesc}>
                        Compatible con React, Vue, Angular, Next.js y cualquier framework moderno. Instala el SDK, importa el web component y listo.
                    </p>
                </div>
                
                <div className={styles.featureCard}>
                    <span className={styles.featureIcon}>🛠️</span>
                    <h3 className={styles.featureTitle}>Personalización avanzada</h3>
                    <p className={styles.featureDesc}>
                        Modos claro/oscuro, layouts grid/list, slots y CSS variables. Extiende el widget o crea tu propia UI sobre la API.
                    </p>
                </div>

                <div className={styles.featureCard}>
                    <span className={styles.featureIcon}>🔐</span>
                    <h3 className={styles.featureTitle}>Seguridad y control</h3>
                    <p className={styles.featureDesc}>
                        Whitelist de dominios, protección anti-spam, autenticación JWT y cumplimiento para empresas.
                    </p>
                </div>
            </section>

            {/* Self-Hosting Section */}
            <section className={styles.selfHostSection}>
                <div className={styles.selfHostContent}>
                    <h2 className={styles.selfHostTitle}>Autohospedaje: Control total para desarrolladores</h2>
                    <p className={styles.selfHostSubtitle}>
                        Testimo es la única plataforma de testimonios pensada para devs: ejecuta tu propio backend, conecta tu base de datos y mantén la experiencia de widget y panel sin lock-in. Ideal para arquitecturas enterprise, SaaS multi-tenant o proyectos con requisitos de compliance y residencia de datos.
                    </p>
                    <ul className={styles.selfHostList}>
                        <li><b>Propiedad absoluta de los datos:</b> Almacena testimonios en tu stack (Postgres, Mongo, serverless, etc).</li>
                        <li><b>Endpoints API custom:</b> El widget consume cualquier REST API (Node, Go, Python, serverless, no-code... lo que uses).</li>
                        <li><b>Integración CI/CD:</b> Automatiza despliegues, versiona el widget y conecta con pipelines internos.</li>
                        <li><b>SDK open source:</b> Audita, extiende o forkea el código. Sin cajas negras.</li>
                        <li><b>Integraciones avanzadas:</b> Conecta con CRMs, sistemas internos, analytics o microservicios.</li>
                    </ul>
                    <div className={styles.selfHostCodeBlock}>
                        <pre>{`<!-- Ejemplo: Widget apuntando a tu API -->
<testimo-widget 
  organization-id="acme-corp" 
  api-url="https://api.acme.com/testimonios"
  theme="dark"
  layout="grid"
></testimo-widget>`}</pre>
                    </div>
                    <p className={styles.selfHostNote}>
                        <b>¿Dudas técnicas?</b> Soporte para despliegues on-premise, integración con SSO, auditoría de seguridad y consultoría para arquitecturas complejas. <a href="mailto:enterprise@testimo.app" style={{color:'#007bff'}}>Contáctanos</a>.
                    </p>
                </div>
            </section>

            {/* Code Preview Section */}
            <section className={styles.codeSection}>
                <h2 className={styles.codeTitle}>Pensado para desarrolladores</h2>
                <p className={styles.codeSubtitle}>
                    API limpia, tipado fuerte, web components estándar y documentación clara. Integra, automatiza y escala sin fricción.
                </p>
                <div className={styles.codeContainer}>
                    <pre style={{color: '#fff', textAlign: 'left', overflowX: 'auto'}}>
{`<!-- Usa nuestro cloud o conecta tu backend propio -->
<testimo-widget 
  organization-id="tu-org-id" 
  api-url="https://api.tuempresa.com/testimonios"
></testimo-widget>`}
                    </pre>
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <p>&copy; {new Date().getFullYear()} Testimo CMS. Hecho por y para desarrolladores.</p>
            </footer>
        </div>
    );
};