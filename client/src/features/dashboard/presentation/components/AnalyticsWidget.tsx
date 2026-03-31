import React, { useEffect, useState } from 'react';
import styles from './AnalyticsWidget.module.css';

const API_URL = 'http://hackathoncubepath-server-zzxmva-37677b-108-165-47-237.traefik.me';

interface AnalyticsWidgetProps {
  organizationId: string;
}

export const AnalyticsWidget: React.FC<AnalyticsWidgetProps> = ({ organizationId }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ views: number; clicks: number; approved: number; pending: number }>({
    views: 0,
    clicks: 0,
    approved: 0,
    pending: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [viewsRes, clicksRes] = await Promise.all([
          fetch(`${API_URL}/analytics/stats?organizationId=${organizationId}&type=view`),
          fetch(`${API_URL}/analytics/stats?organizationId=${organizationId}&type=click`),
        ]);
        if (!viewsRes.ok || !clicksRes.ok) throw new Error('Error fetching analytics');
        const viewsData = await viewsRes.json();
        const clicksData = await clicksRes.json();
        setStats(prev => ({
          ...prev,
          views: viewsData.count || 0,
          clicks: clicksData.count || 0,
        }));
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error al cargar analíticas';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [organizationId]);

  if (loading) return <div className={styles.loading}>Cargando estadísticas...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  const statItems = [
    { label: 'Vistas del widget', value: stats.views, icon: '👁️', variant: 'views' },
    { label: 'Clics en testimonios', value: stats.clicks, icon: '👆', variant: 'clicks' },
    { label: 'Testimonios aprobados', value: stats.approved, icon: '✅', variant: 'approved' },
    { label: 'Pendientes de aprobación', value: stats.pending, icon: '⏳', variant: 'pending' },
  ];

  return (
    <div className={styles.container}>
      {statItems.map((stat) => (
        <div key={stat.label} className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles[stat.variant]}`}>
            {stat.icon}
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
