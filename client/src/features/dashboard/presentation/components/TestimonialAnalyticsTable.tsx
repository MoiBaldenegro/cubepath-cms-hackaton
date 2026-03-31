import React, { useEffect, useState, useMemo } from 'react';
import type { Testimonial } from '../../../testimonials/domain/Testimonial';
import { ExportAnalyticsButton } from './ExportAnalyticsButton';
import { TestimonialAnalyticsChart } from './TestimonialAnalyticsChart';
import { AnalyticsDateFilter } from './AnalyticsDateFilter';
import { AnalyticsCategoryFilter } from './AnalyticsCategoryFilter';
import { AnalyticsAuthorFilter } from './AnalyticsAuthorFilter';
import { AnalyticsStatusFilter } from './AnalyticsStatusFilter';
import { TestimonialStatus } from '../../../testimonials/domain/Testimonial';

const API_URL = 'http://hackathoncubepath-server-zzxmva-37677b-108-165-47-237.traefik.me';

interface TestimonialAnalyticsTableProps {
  organizationId: string;
  testimonials: Testimonial[];
}

interface AnalyticsMap {
  [testimonialId: string]: { views: number; clicks: number };
}

export const TestimonialAnalyticsTable: React.FC<TestimonialAnalyticsTableProps> = ({ organizationId, testimonials }) => {
  const [analytics, setAnalytics] = useState<AnalyticsMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState('');

  // Filtros únicos
  const categories = Array.from(new Set(testimonials.map(t => t.category))).filter(Boolean);
  const authors = Array.from(new Set(testimonials.map(t => t.author))).filter(Boolean);
  const statuses = Object.values(TestimonialStatus);

  // Filtrado local de testimonios (memoizado para evitar nuevas referencias en cada render)
  const filteredTestimonials = useMemo(() => {
    return testimonials.filter(t => {
      if (category && t.category !== category) return false;
      if (author && t.author !== author) return false;
      if (status && t.status !== status) return false;
      return true;
    });
  }, [testimonials, category, author, status]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const testimonialIds = filteredTestimonials.map(t => t.id);
        const [viewsRes, clicksRes] = await Promise.all([
          fetch(`${API_URL}/analytics/batch-stats?organizationId=${organizationId}&testimonialIds=${testimonialIds.join(',')}&type=view`),
          fetch(`${API_URL}/analytics/batch-stats?organizationId=${organizationId}&testimonialIds=${testimonialIds.join(',')}&type=click`)
        ]);
        const viewsData = await viewsRes.json();
        const clicksData = await clicksRes.json();
        const results: AnalyticsMap = {};
        for (const id of testimonialIds) {
          results[id] = {
            views: viewsData.stats[id] ?? 0,
            clicks: clicksData.stats[id] ?? 0
          };
        }
        setAnalytics(results);
      } catch (err) {
        setError((err as Error)?.message || 'Error fetching analytics');
      } finally {
        setLoading(false);
      }
    };
    if (filteredTestimonials.length > 0) fetchAnalytics();
  }, [organizationId, category, author, status, from, to, testimonials, filteredTestimonials]);

  if (loading) return <div style={{ padding: 16 }}>Cargando analíticas por testimonio...</div>;
  if (error) return <div style={{ color: 'red', padding: 16 }}>{error}</div>;

  return (
    <div style={{ margin: '32px 0' }}>
      <h4 style={{ marginBottom: 16 }}>Analíticas por Testimonio</h4>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 8 }}>
        <AnalyticsCategoryFilter value={category} onChange={setCategory} categories={categories} />
        <AnalyticsAuthorFilter value={author} onChange={setAuthor} authors={authors} />
        <AnalyticsStatusFilter value={status} onChange={setStatus} statuses={statuses} />
        <AnalyticsDateFilter from={from} to={to} setFrom={setFrom} setTo={setTo} />
      </div>
      <ExportAnalyticsButton testimonials={filteredTestimonials} analytics={analytics} />
      <TestimonialAnalyticsChart testimonials={filteredTestimonials} analytics={analytics} />
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001' }}>
        <thead>
          <tr style={{ background: '#f3f4f6' }}>
            <th style={{ padding: 8, textAlign: 'left' }}>Testimonio</th>
            <th style={{ padding: 8 }}>Vistas</th>
            <th style={{ padding: 8 }}>Clics</th>
          </tr>
        </thead>
        <tbody>
          {filteredTestimonials.map(t => (
            <tr key={t.id}>
              <td style={{ padding: 8 }}>{t.content.slice(0, 60)}{t.content.length > 60 ? '…' : ''}</td>
              <td style={{ padding: 8, textAlign: 'center' }}>{analytics[t.id]?.views ?? 0}</td>
              <td style={{ padding: 8, textAlign: 'center' }}>{analytics[t.id]?.clicks ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
