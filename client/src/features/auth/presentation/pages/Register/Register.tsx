import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../AuthForm.module.css';
import { registerUseCase } from '../../../../../di/auth';
import { supabase } from '../../../../../shared/infrastructure/supabase';

export const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await registerUseCase.run(email, password, 'local');
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            console.error('Error registering', error);
            alert('Registration failed.');
        }
    };

    const handleSocialLogin = async (provider: 'google' | 'github') => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: { redirectTo: window.location.origin + '/login' }
        });
        if (error) alert(error.message);
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.logo}>💬</div>
                    <h2 className={styles.title}>Create Account</h2>
                    <p className={styles.subtitle}>Start collecting testimonials today</p>
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
                                placeholder="you@example.com"
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
                    
                    <button type="submit" className={styles.button}>Create Account</button>

                    <div className={styles.divider}>
                        <span className={styles.dividerLine}></span>
                        <span className={styles.dividerText}>Or sign up with</span>
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

                    <p className={styles.link}>
                        Already have an account? <Link to="/login">Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};
