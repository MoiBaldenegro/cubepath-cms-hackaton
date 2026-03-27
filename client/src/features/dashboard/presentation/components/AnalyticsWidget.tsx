import React, { useEffect, useState } from 'react';

interface AnalyticsWidgetProps {
  organizationId: string;
}

export const AnalyticsWidget: React.FC<AnalyticsWidgetProps> = ({ organizationId }) => {
  const [loading, setLoading] = useState(true);
  const [views, setViews] = useState<number | null>(null);
  const [clicks, setClicks] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://cubepathhackaton-api-aymrvj-31e30c-108-165-47-144.traefik.me';
        const [viewsRes, clicksRes] = await Promise.all([
          fetch(`${apiUrl}/analytics/stats?organizationId=${organizationId}&type=view`),
          fetch(`${apiUrl}/analytics/stats?organizationId=${organizationId}&type=click`),
        ]);
        if (!viewsRes.ok || !clicksRes.ok) throw new Error('Error fetching analytics');
        const viewsData = await viewsRes.json();
        const clicksData = await clicksRes.json();
        setViews(viewsData.count);
        setClicks(clicksData.count);
      } catch (err: any) {
        setError(err.message || 'Error fetching analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [organizationId]);

  if (loading) return <div style={{ padding: 16 }}>Cargando analíticas...</div>;
  if (error) return <div style={{ color: 'red', padding: 16 }}>{error}</div>;

  return (
    <div style={{ background: '#f3f4f6', borderRadius: 8, padding: 24, margin: '24px 0', boxShadow: '0 2px 8px #0001', display: 'flex', gap: 32, justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: '#3b82f6' }}>{views ?? 0}</div>
        <div style={{ fontSize: 14, color: '#555' }}>Vistas del widget</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: '#f59e0b' }}>{clicks ?? 0}</div>
        <div style={{ fontSize: 14, color: '#555' }}>Clics en testimonios</div>
      </div>
    </div>
  );
};
