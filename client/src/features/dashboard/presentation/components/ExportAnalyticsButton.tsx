import React from 'react';
import type { Testimonial } from '../../../testimonials/domain/Testimonial';

interface AnalyticsMap {
  [testimonialId: string]: { views: number; clicks: number };
}

export const ExportAnalyticsButton: React.FC<{ testimonials: Testimonial[]; analytics: AnalyticsMap }> = ({ testimonials, analytics }) => {
  const handleExport = () => {
    const headers = ['ID', 'Autor', 'Contenido', 'Vistas', 'Clics'];
    const rows = testimonials.map(t => [
      t.id,
      t.author,
      t.content.replace(/\n/g, ' '),
      analytics[t.id]?.views ?? 0,
      analytics[t.id]?.clicks ?? 0,
    ]);
    const csv = [headers, ...rows].map(r => r.map(x => `"${String(x).replace(/"/g, '""')}` ).join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analiticas_testimonios.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <button onClick={handleExport} style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', marginBottom: 16 }}>
      Exportar analíticas a Excel
    </button>
  );
};
