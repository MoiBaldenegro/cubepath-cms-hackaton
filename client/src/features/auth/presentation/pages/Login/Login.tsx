import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
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
                        // Assuming response struct is { token: string, user: User }
                        // If socialLoginUseCase only returns token, we might need to change it or fetch user manually.
                        // Based on server controller, socialLogin returns whatever socialAuthService.run returns.
                        // Assuming it returns LoginResponse.
                         const responseData = response as any; // Temporary cast until types are synced
                         if(responseData.user) {
                             login({ ...responseData.user, role: responseData.user.role as UserRole }, responseData.token);
                         } else {
                             // Fallback if only token is returned
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
            const data = response as any; // Temporary cast
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
                <h2 className={styles.title}>Welcome Back UPDATE</h2>
                
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <input
                            type="email"
                            id="email"
                            className={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>Password</label>
                        <input
                            type="password"
                            id="password"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className={styles.button}>Sign In</button>
                    
                    <div style={{ margin: '20px 0', borderTop: '1px solid #ccc', position: 'relative', textAlign: 'center' }}>
                        <span style={{ position: 'absolute', top: -10, background: '#fff', padding: '0 10px', color: '#666', left: '50%', transform: 'translateX(-50%)' }}>Or continue with</span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '30px' }}>
                        <button type="button" onClick={() => handleSocialLogin('google')} style={{ padding: '10px 20px', cursor: 'pointer', background: '#DB4437', color: 'white', border: 'none', borderRadius: '4px' }}>Google</button>
                        <button type="button" onClick={() => handleSocialLogin('github')} style={{ padding: '10px 20px', cursor: 'pointer', background: '#333', color: 'white', border: 'none', borderRadius: '4px' }}>GitHub</button>
                    </div>

                    <div style={{ marginTop: '25px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                        <button 
                            type="button" 
                            onClick={() => { loginAsDemo(); navigate('/dashboard'); }} 
                            style={{ 
                                padding: '10px 15px', 
                                cursor: 'pointer', 
                                background: '#f8f9fa', 
                                color: '#333', 
                                border: '1px solid #ddd', 
                                borderRadius: '4px',
                                width: '100%',
                                fontWeight: 'bold'
                            }}
                        >
                            🚀 Try Demo (No Login)
                        </button>
                    </div>

                    <p className={styles.link}>
                        Don't have an account? <Link to="/register">Create one</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};