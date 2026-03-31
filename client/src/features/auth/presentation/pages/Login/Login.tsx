import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../AuthForm.module.css';
import { loginUseCase, socialLoginUseCase } from '../../../../../di/auth';
import { supabase } from '../../../../../shared/infrastructure/supabase';
import { useAuth } from '../../../../../shared/contexts/useAuth';
import { UserRole } from '../../../../users/domain/UserRole';

interface LoginResponse {
  token: string;
  user?: {
    id: string;
    email: string;
    role: UserRole;
    organizationId?: string;
  };
}

const TestimoLogo = () => (
  <svg width="36" height="36" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="notif_grad_login" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38bdf8"/>
        <stop offset="100%" stopColor="#2563eb"/> 
      </linearGradient>
      <mask id="cutout-mask-login">
        <rect width="100%" height="100%" fill="white"/>
        <circle cx="416" cy="112" r="80" fill="black"/>
      </mask>
    </defs>
    <rect x="64" y="80" width="384" height="160" rx="80" fill="#18181B"/>
    <rect x="176" y="208" width="160" height="256" rx="80" fill="#18181B"/>
    <circle cx="416" cy="112" r="80" fill="#18181B"/>
    <rect x="96" y="112" width="320" height="96" rx="48" fill="white" mask="url(#cutout-mask-login)"/>
    <rect x="208" y="240" width="96" height="192" rx="48" fill="white"/>
    <circle cx="416" cy="112" r="48" fill="url(#notif_grad_login)"/>
  </svg>
);

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login, loginAsDemo } = useAuth();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user && session.user.app_metadata.provider !== 'email') {
                try {
                    const response = await socialLoginUseCase.run(
                        session.user.email!,
                        session.user.id,
                        session.user.app_metadata.provider || 'supabase'
                    );
                    
                    if (response.token) {
                         const responseData = response as LoginResponse;
                         if(responseData.user) {
                             login({ 
                               id: responseData.user.id, 
                               email: responseData.user.email, 
                               role: responseData.user.role,
                               organizationId: responseData.user.organizationId || ''
                             }, responseData.token);
                         } else {
                            localStorage.setItem('token', response.token);
                         }
                        navigate('/dashboard');
                    }
                } catch (error) {
                    console.error('Error de sincronización', error);
                }
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [navigate, login]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await loginUseCase.run(email, password, 'local');
            const data = response as LoginResponse;
            if (data.token) {
                 if(data.user) {
                     login({ 
                       id: data.user.id, 
                       email: data.user.email, 
                       role: data.user.role,
                       organizationId: data.user.organizationId || ''
                     }, data.token);
                 } else {
                    localStorage.setItem('token', data.token);
                 }
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error al iniciar sesión', error);
        } finally {
            setIsLoading(false);
        }
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
                        Más de 2,500 empresas confían en nosotros
                    </div>

                    <h1 className={styles.headline}>
                        Recopila y muestra <span className={styles.headlineAccent}>testimonios de clientes</span> que convierten
                    </h1>

                    <p className={styles.subheadline}>
                        La plataforma integral para recopilar reseñas auténticas, 
                        mostrarlas de forma hermosa y generar confianza con tus clientes.
                    </p>

                    <div className={styles.stats}>
                        <div className={styles.statItem}>
                            <div className={styles.statValue}>47%</div>
                            <div className={styles.statLabel}>Aumento en conversiones</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.statValue}>5min</div>
                            <div className={styles.statLabel}>Tiempo de configuración</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.statValue}>99.9%</div>
                            <div className={styles.statLabel}>Disponibilidad</div>
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
                        <h2 className={styles.formTitle}>¡Bienvenido de nuevo!</h2>
                        <p className={styles.formSubtitle}>Inicia sesión en tu cuenta</p>
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
                                    placeholder="Ingresa tu contraseña"
                                    required
                                />
                                <span className={styles.inputIcon}>🔒</span>
                            </div>
                        </div>

                        <button type="submit" className={styles.button} disabled={isLoading}>
                            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                        </button>
                        
                        <div className={styles.divider}>
                            <span className={styles.dividerLine}></span>
                            <span className={styles.dividerText}>o continua</span>
                            <span className={styles.dividerLine}></span>
                        </div>

                        <button 
                            type="button" 
                            onClick={() => { loginAsDemo(); navigate('/dashboard'); }} 
                            className={styles.demoButton}
                        >
                            <span className={styles.demoIcon}>🚀</span>
                            Probar modo demo
                        </button>

                        <p className={styles.link}>
                            ¿No tienes cuenta? <Link to="/register">Regístrate gratis</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};
