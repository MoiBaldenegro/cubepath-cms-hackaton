import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../AuthForm.module.css';
import { registerUseCase } from '../../../../../di/auth';
import { supabase } from '../../../../../shared/infrastructure/supabase';

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
            console.error('Error registering', error);
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
                            Setting up took less than 5 minutes. Now we collect 
                            customer testimonials on autopilot and display them everywhere.
                        </p>
                        <div className={styles.testimonialAuthor}>
                            <div className={styles.authorAvatar}>👤</div>
                            <div>
                                <div className={styles.authorName}>Marcus Johnson</div>
                                <div className={styles.authorRole}>Founder, LaunchPad</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.features}>
                    <div className={styles.featureItem}>
                        <span className={styles.featureIcon}>✓</span>
                        Free forever plan available
                    </div>
                    <div className={styles.featureItem}>
                        <span className={styles.featureIcon}>✓</span>
                        No credit card required
                    </div>
                    <div className={styles.featureItem}>
                        <span className={styles.featureIcon}>✓</span>
                        Export data anytime
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
                        <h2 className={styles.formTitle}>Create your account</h2>
                        <p className={styles.formSubtitle}>Start collecting testimonials today</p>
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
                                    placeholder="Create a strong password"
                                    required
                                />
                            </div>
                        </div>
                        
                        <button type="submit" className={styles.button} disabled={isLoading}>
                            {isLoading ? 'Creating account...' : 'Create account'}
                        </button>

                        <div className={styles.divider}>
                            <span className={styles.dividerLine}></span>
                            <span className={styles.dividerText}>or sign up with</span>
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
                            By creating an account, you agree to our{' '}
                            <a href="#terms">Terms of Service</a> and{' '}
                            <a href="#privacy">Privacy Policy</a>
                        </p>

                        <p className={styles.link}>
                            Already have an account? <Link to="/login">Sign in</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};
