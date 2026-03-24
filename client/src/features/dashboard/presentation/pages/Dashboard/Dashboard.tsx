import { useState } from 'react';
import styles from './Dashboard.module.css';
import { useAuth } from '../../../../../shared/contexts/AuthContext';
import { UserRole } from '../../../../users/domain/UserRole';
import { CreateTestimonialForm } from '../../../../testimonials/presentation/components/CreateTestimonialForm';
import { TestimonialList } from '../../../../testimonials/presentation/components/TestimonialList';
import { UserList } from '../../../../users/presentation/components/UserList';
import { useNavigate } from 'react-router-dom';
import { EmbedWidget } from '../../../../widget/presentation/components/EmbedWidget';

export const Dashboard = () => {
  const { user, logout, isLoading } = useAuth();
  const [activeView, setActiveView] = useState('overview');
  const navigate = useNavigate();

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const isAdmin = user.role === UserRole.ADMIN;
  const isEditor = user.role === UserRole.EDITOR;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>CubePath CMS</div>
        <div className={styles.userInfo}>
          <small>{user.email}</small>
          <div className={styles.roleBadge}>{user.role}</div>
        </div>
        
        <nav className={styles.nav}>
          <div 
            className={`${styles.navItem} ${activeView === 'overview' ? styles.active : ''}`}
            onClick={() => setActiveView('overview')}
          >
            Overview
          </div>
          
          <div 
            className={`${styles.navItem} ${activeView === 'testimonials' ? styles.active : ''}`}
            onClick={() => setActiveView('testimonials')}
          >
            All Testimonials
          </div>

          {(isAdmin || isEditor) && (
            <div 
              className={`${styles.navItem} ${activeView === 'create-testimonial' ? styles.active : ''}`}
              onClick={() => setActiveView('create-testimonial')}
            >
              Add Testimonial
            </div>
          )}
          
          <div 
            className={`${styles.navItem} ${activeView === 'embed' ? styles.active : ''}`}
            onClick={() => setActiveView('embed')}
          >
            Embed Widget
          </div>

          {isAdmin && (
            <div 
              className={`${styles.navItem} ${activeView === 'users' ? styles.active : ''}`}
              onClick={() => setActiveView('users')}
            >
              Users
            </div>
          )}

          <div className={styles.navItem} onClick={handleLogout}>
            Logout
          </div>
        </nav>
      </aside>
      
      <main className={styles.main}>
        <header className={styles.header}>
          <h1>
            {activeView === 'overview' && 'Dashboard Overview'}
            {activeView === 'testimonials' && 'Testimonials'}
            {activeView === 'create-testimonial' && 'Create Testimonial'}
            {activeView === 'embed' && 'Embed Widget'}
            {activeView === 'users' && 'User Management'}
          </h1>
        </header>

        <div className={styles.content}>
          {activeView === 'overview' && (
            <div className={styles.card}>
              <h3>Welcome, {user.email}</h3>
              <p>Select an option from the sidebar to manage content.</p>
            </div>
          )}

          {activeView === 'testimonials' && (
            <div className={styles.card}>
              <TestimonialList isAdmin={isAdmin} />
            </div>
          )}

          {activeView === 'create-testimonial' && (
            <div className={styles.card}>
              <CreateTestimonialForm onSuccess={() => setActiveView('testimonials')} />
            </div>
          )}
          
          {activeView === 'embed' && (
            <div className={styles.card}>
              <EmbedWidget />
            </div>
          )}

          {activeView === 'users' && isAdmin && (
            <div className={styles.card}>
              <UserList />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
