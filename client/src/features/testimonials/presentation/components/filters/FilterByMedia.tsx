import React from 'react';

interface FilterByMediaProps {
  value: string;
  onChange: (value: string) => void;
}

export const FilterByMedia: React.FC<FilterByMediaProps> = ({ value, onChange }) => (
  <div style={{ minWidth: 120 }}>
    <label style={{ fontWeight: 600, fontSize: 13 }}>Media:</label>
    <select value={value} onChange={e => onChange(e.target.value)} style={{ width: '100%', padding: 6, borderRadius: 6 }}>
      <option value="">Todos</option>
      <option value="image">Con imagen</option>
      <option value="video">Con video</option>
      <option value="none">Sin media</option>
    </select>
  </div>
);