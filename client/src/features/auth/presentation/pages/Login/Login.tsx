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
            alert('Login failed. Please check your credentials.');
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
                    <h2 className={styles.title}>Welcome Back</h2>
                    <p className={styles.subtitle}>Sign in to your CubePath account</p>
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
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className={styles.button}>Sign In</button>
                    
                    <div className={styles.divider}>
                        <span className={styles.dividerLine}></span>
                        <span className={styles.dividerText}>Or continue with</span>
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
                        🚀 Try Demo (No Login)
                    </button>

                    <p className={styles.link}>
                        Don't have an account? <Link to="/register">Create one</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};
