import React from 'react';
import type { Testimonial } from '../../../domain/Testimonial';

export const ExportToExcelButton: React.FC<{ data: Testimonial[] }> = ({ data }) => {
  const handleExport = () => {
    // Simple CSV export (Excel compatible)
    const headers = [
      'ID', 'Autor', 'Contenido', 'Calificación', 'Categoría', 'Estado', 'Tags', 'Imagen', 'Video', 'Fecha'
    ];
    const rows = data.map(t => [
      t.id,
      t.author,
      t.content.replace(/\n/g, ' '),
      t.rating,
      t.category,
      t.status,
      (t.tags || []).join(','),
      t.imageUrl || '',
      t.videoUrl || '',
      t.createdAt ? new Date(t.createdAt).toLocaleString() : ''
    ]);
    const csv = [headers, ...rows].map(r => r.map(x => `"${String(x).replace(/"/g, '""')}` ).join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'testimonios.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <button onClick={handleExport} style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>
      Exportar a Excel
    </button>
  );
};
