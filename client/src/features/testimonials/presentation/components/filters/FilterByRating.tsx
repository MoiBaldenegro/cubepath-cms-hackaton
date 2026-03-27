import React from 'react';

interface FilterByRatingProps {
  value: string;
  onChange: (value: string) => void;
}

export const FilterByRating: React.FC<FilterByRatingProps> = ({ value, onChange }) => (
  <div style={{ minWidth: 120 }}>
    <label style={{ fontWeight: 600, fontSize: 13 }}>Calificación:</label>
    <select value={value} onChange={e => onChange(e.target.value)} style={{ width: '100%', padding: 6, borderRadius: 6 }}>
      <option value="">Todas</option>
      {[5,4,3,2,1].map(rating => (
        <option key={rating} value={rating}>{'★'.repeat(rating)}</option>
      ))}
    </select>
  </div>
);