import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../AuthForm.module.css';
import { loginUseCase, socialLoginUseCase } from '../../../../../di/auth';
import { supabase } from '../../../../../shared/infrastructure/supabase';
import { useAuth } from '../../../../../shared/contexts/AuthContext';
import { UserRole } from '../../../../users/domain/UserRole';

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
                         const responseData = response as any;
                         if(responseData.user) {
                             login({ ...responseData.user, role: responseData.user.role as UserRole }, responseData.token);
                         } else {
                            localStorage.setItem('token', response.token);
                         }
                        navigate('/dashboard');
                    }
                } catch (error) {
                    console.error('Sync failed', error);
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
            const data = response as any;
            if (data.token) {
                 if(data.user) {
                     login({ ...data.user, role: data.user.role as UserRole }, data.token);
                 } else {
                    localStorage.setItem('token', data.token);
                 }
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error logging in', error);
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
            <div className={styles.leftPanel}>
                <div className={styles.leftPanelContent}>
                    <div className={styles.logo}>
                        <div className={styles.logoIcon}>💬</div>
                        CubePath
                    </div>

                    <div className={styles.testimonialCard}>
                        <div className={styles.quoteIcon}>"</div>
                        <p className={styles.testimonialText}>
                            CubePath transformed how we collect and display testimonials. 
                            Our conversion rate increased by 47% after implementing it.
                        </p>
                        <div className={styles.testimonialAuthor}>
                            <div className={styles.authorAvatar}>👤</div>
                            <div>
                                <div className={styles.authorName}>Sarah Chen</div>
                                <div className={styles.authorRole}>Head of Growth, TechStart</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.features}>
                    <div className={styles.featureItem}>
                        <span className={styles.featureIcon}>✓</span>
                        Collect testimonials from any channel
                    </div>
                    <div className={styles.featureItem}>
                        <span className={styles.featureIcon}>✓</span>
                        Beautiful embeddable widgets
                    </div>
                    <div className={styles.featureItem}>
                        <span className={styles.featureIcon}>✓</span>
                        Real-time analytics dashboard
                    </div>
                </div>

                <div className={styles.decoration + ' ' + styles.decoration1}></div>
                <div className={styles.decoration + ' ' + styles.decoration2}></div>
            </div>

            <div className={styles.rightPanel}>
                <div className={styles.formCard}>
                    <div className={styles.mobileLogo}>
                        <div className={styles.mobileLogoIcon}>💬</div>
                        <span className={styles.mobileLogoText}>CubePath</span>
                    </div>

                    <div className={styles.formHeader}>
                        <h2 className={styles.formTitle}>Welcome back</h2>
                        <p className={styles.formSubtitle}>Sign in to manage your testimonials</p>
                    </div>
                    
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email" className={styles.label}>Email</label>
                            <div className={styles.inputWrapper}>
                                <span className={styles.inputIcon}>📧</span>
                                <input
                                    type="email"
                                    id="email"
                                    className={styles.input}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="password" className={styles.label}>Password</label>
                            <div className={styles.inputWrapper}>
                                <span className={styles.inputIcon}>🔒</span>
                                <input
                                    type="password"
                                    id="password"
                                    className={styles.input}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className={styles.button} disabled={isLoading}>
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                        
                        <div className={styles.divider}>
                            <span className={styles.dividerLine}></span>
                            <span className={styles.dividerText}>or continue with</span>
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

                        <button 
                            type="button" 
                            onClick={() => { loginAsDemo(); navigate('/dashboard'); }} 
                            className={styles.demoButton}
                        >
                            🚀 Try Demo Mode
                        </button>

                        <p className={styles.link}>
                            Don't have an account? <Link to="/register">Sign up</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};
