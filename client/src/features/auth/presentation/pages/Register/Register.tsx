import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Register.module.css';
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
    
    // ... rest of component ...


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
                <h2 className={styles.title}>Create Account</h2>
                
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
                    
                    <button type="submit" className={styles.button}>Sign Up</button>

                    <div style={{ margin: '20px 0', borderTop: '1px solid #ccc', position: 'relative', textAlign: 'center' }}>
                        <span style={{ position: 'absolute', top: -10, background: '#fff', padding: '0 10px', color: '#666', left: '50%', transform: 'translateX(-50%)' }}>Or sign up with</span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '30px' }}>
                        <button type="button" onClick={() => handleSocialLogin('google')} style={{ padding: '10px 20px', cursor: 'pointer', background: '#DB4437', color: 'white', border: 'none', borderRadius: '4px' }}>Google</button>
                        <button type="button" onClick={() => handleSocialLogin('github')} style={{ padding: '10px 20px', cursor: 'pointer', background: '#333', color: 'white', border: 'none', borderRadius: '4px' }}>GitHub</button>
                    </div>

                    <p className={styles.link}>
                        Already have an account? <Link to="/login">Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};