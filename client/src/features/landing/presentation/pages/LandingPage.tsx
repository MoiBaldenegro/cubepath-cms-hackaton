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
                    <Link to="/features" className={styles.navLink}>Features</Link>
                    <Link to="/pricing" className={styles.navLink}>Pricing</Link>
                    <Link to="/docs" className={styles.navLink}>Docs</Link>
                </div>

                <div className={styles.authButtons}>
                    <Link to="/login" className={styles.loginBtn}>Login</Link>
                    <Link to="/register" className={styles.navCta}>Get Started</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className={styles.hero}>
                <span className={styles.heroBadge}>New: Interactive Testimonial Widgets</span>
                <h1 className={styles.title}>
                    Turn Customer Love into <br />
                    <span style={{color: '#007bff'}}>Growth for your Business</span>
                </h1>
                <p className={styles.subtitle}>
                    Collect, manage, and showcase testimonials with ease. 
                    Embed beautiful widgets on any website in seconds—no coding required.
                </p>
                <div className={styles.ctaGroup}>
                    <Link to="/register" className={styles.primaryCta}>Start Free Trial</Link>
                    <a href="#" onClick={handleDemo} className={styles.secondaryCta}>View Live Demo</a>
                </div>
            </header>

            {/* Features Grid */}
            <section className={styles.features}>
                <div className={styles.featureCard}>
                    <span className={styles.featureIcon}>🚀</span>
                    <h3 className={styles.featureTitle}>Easy Integration</h3>
                    <p className={styles.featureDesc}>
                        Works with React, Vue, Angular, Next.js, and more. 
                        Copy-paste our SDK and go live in minutues.
                    </p>
                </div>
                
                <div className={styles.featureCard}>
                    <span className={styles.featureIcon}>🎨</span>
                    <h3 className={styles.featureTitle}>Fully Customizable</h3>
                    <p className={styles.featureDesc}>
                        Match your brand identity with dark/light modes, 
                        grid/list layouts, and custom CSS support.
                    </p>
                </div>

                <div className={styles.featureCard}>
                    <span className={styles.featureIcon}>🔒</span>
                    <h3 className={styles.featureTitle}>Secure & Reliable</h3>
                    <p className={styles.featureDesc}>
                        Domain whitelisting, spam protection, and 
                        enterprise-grade security built-in from day one.
                    </p>
                </div>
            </section>

            {/* Self-Hosting Section */}
            <section className={styles.selfHostSection}>
                <div className={styles.selfHostContent}>
                    <h2 className={styles.selfHostTitle}>Self-Hosting: Total Control, Zero Limits</h2>
                    <p className={styles.selfHostSubtitle}>
                        Testimo is the only testimonial platform that lets you <b>run your own backend</b> with the same beautiful widgets and admin experience. Perfect for teams with strict compliance, data residency, or advanced integration needs.
                    </p>
                    <ul className={styles.selfHostList}>
                        <li><b>Full Data Ownership:</b> Store testimonials in your own database, on your own infrastructure.</li>
                        <li><b>Custom API Endpoints:</b> Point the widget to any REST API—Node, Python, Go, or even no-code backends.</li>
                        <li><b>Enterprise Compliance:</b> Meet GDPR, HIPAA, or internal audit requirements with ease.</li>
                        <li><b>Advanced Integrations:</b> Connect with internal tools, CRMs, or analytics pipelines.</li>
                        <li><b>Open Source SDK:</b> Fork, extend, or audit the widget code for maximum transparency.</li>
                    </ul>
                    <div className={styles.selfHostCodeBlock}>
                        <pre>{`<!-- Example: Pointing the widget to your own API -->
<testimo-widget 
  organization-id="acme-corp" 
  api-url="https://api.acme.com/testimonials"
  theme="dark"
  layout="grid"
></testimo-widget>`}</pre>
                    </div>
                    <p className={styles.selfHostNote}>
                        <b>Need help?</b> Our team can assist with on-premise deployments, custom integrations, and security reviews. <a href="mailto:enterprise@testimo.app" style={{color:'#007bff'}}>Contact us</a> for a tailored solution.
                    </p>
                </div>
            </section>

            {/* Code Preview Section */}
            <section className={styles.codeSection}>
                <h2 className={styles.codeTitle}>Developers Love It</h2>
                <p className={styles.codeSubtitle}>
                    Clean API, strong types, and web components standard. 
                    It feels like magic, but it's just great engineering.
                </p>
                
                <div className={styles.codeContainer}>
                    <pre style={{color: '#fff', textAlign: 'left', overflowX: 'auto'}}>
{`<!-- Use our cloud or plug your own backend -->
<testimo-widget 
  organization-id="your-org-id" 
  api-url="https://api.testimo.app"
></testimo-widget>`}
                    </pre>
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <p>&copy; {new Date().getFullYear()} Testimo CMS. Built with ❤️ for the Hackathon.</p>
            </footer>
        </div>
    );
};