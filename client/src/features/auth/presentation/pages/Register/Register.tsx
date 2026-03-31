import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../AuthForm.module.css';
import { registerUseCase } from '../../../../../di/auth';
import { supabase } from '../../../../../shared/infrastructure/supabase';

const TestimoLogo = () => (
  <svg width="36" height="36" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="notif_grad_register" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38bdf8"/>
        <stop offset="100%" stopColor="#2563eb"/> 
      </linearGradient>
      <mask id="cutout-mask-register">
        <rect width="100%" height="100%" fill="white"/>
        <circle cx="416" cy="112" r="80" fill="black"/>
      </mask>
    </defs>
    <rect x="64" y="80" width="384" height="160" rx="80" fill="#18181B"/>
    <rect x="176" y="208" width="160" height="256" rx="80" fill="#18181B"/>
    <circle cx="416" cy="112" r="80" fill="#18181B"/>
    <rect x="96" y="112" width="320" height="96" rx="48" fill="white" mask="url(#cutout-mask-register)"/>
    <rect x="208" y="240" width="96" height="192" rx="48" fill="white"/>
    <circle cx="416" cy="112" r="48" fill="url(#notif_grad_register)"/>
  </svg>
);

export const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await registerUseCase.run(email, password, 'local');
            navigate('/login');
        } catch (error) {
            console.error('Error al registrarse', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider: 'google' | 'github') => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: { redirectTo: window.location.origin + '/login' }
        });
        if (error) console.error(error.message);
    };

    return (
        <div className={styles.container}>
            <div className={styles.glowOrb + ' ' + styles.glowOrb1}></div>
            <div className={styles.glowOrb + ' ' + styles.glowOrb2}></div>

            <div className={styles.leftPanel}>
                <div className={styles.leftContent}>
                    <div className={styles.logoSection}>
                        <TestimoLogo />
                        <span className={styles.logoText}>Testimo</span>
                    </div>

                    <div className={styles.testimonialBadge}>
                        <span className={styles.testimonialBadgeDot}></span>
                        Sin tarjeta de crédito requerida
                    </div>

                    <h1 className={styles.headline}>
                        Empieza a recopilar <span className={styles.headlineAccent}>testimonios poderosos</span> en minutos
                    </h1>

                    <p className={styles.subheadline}>
                        Únete a miles de empresas que usan Testimo para generar 
                        prueba social y aumentar conversiones con historias auténticas de clientes.
                    </p>

                    <div className={styles.stats}>
                        <div className={styles.statItem}>
                            <div className={styles.statValue}>Gratis</div>
                            <div className={styles.statLabel}>Plan para siempre</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.statValue}>10k+</div>
                            <div className={styles.statLabel}>Embeds mensuales</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.statValue}>4.9/5</div>
                            <div className={styles.statLabel}>Calificación</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.rightPanel}>
                <div className={styles.formCard}>
                    <div className={styles.mobileBranding}>
                        <TestimoLogo />
                        <span className={styles.mobileLogoText}>Testimo</span>
                    </div>

                    <div className={styles.formHeader}>
                        <h2 className={styles.formTitle}>Crea tu cuenta</h2>
                        <p className={styles.formSubtitle}>Comienza gratis hoy</p>
                    </div>
                    
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email" className={styles.label}>Correo electrónico</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="email"
                                    id="email"
                                    className={styles.input}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tu@empresa.com"
                                    required
                                />
                                <span className={styles.inputIcon}>📧</span>
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="password" className={styles.label}>Contraseña</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="password"
                                    id="password"
                                    className={styles.input}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Crea una contraseña"
                                    required
                                />
                                <span className={styles.inputIcon}>🔒</span>
                            </div>
                            <div className={styles.passwordRequirements}>
                                <div className={styles.requirement}>
                                    <span className={styles.requirementIcon}>✓</span>
                                    Al menos 8 caracteres
                                </div>
                            </div>
                        </div>
                        
                        <button type="submit" className={styles.button} disabled={isLoading}>
                            {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
                        </button>

                        <div className={styles.divider}>
                            <span className={styles.dividerLine}></span>
                            <span className={styles.dividerText}>o regístrate con</span>
                            <span className={styles.dividerLine}></span>
                        </div>

                        <div className={styles.socialButtons}>
                            <button type="button" onClick={() => handleSocialLogin('google')} className={styles.socialButton}>
                                <span className={styles.socialIcon}>🌐</span>
                                Google
                            </button>
                            <button type="button" onClick={() => handleSocialLogin('github')} className={styles.socialButton}>
                                <span className={styles.socialIcon}>🐙</span>
                                GitHub
                            </button>
                        </div>

                        <p className={styles.termsText}>
                            Al crear una cuenta, aceptas nuestros{' '}
                            <a href="#terms">Términos de Servicio</a> y{' '}
                            <a href="#privacy">Política de Privacidad</a>
                        </p>

                        <p className={styles.link}>
                            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};
