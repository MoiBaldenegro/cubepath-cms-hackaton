import React from 'react';

export interface AnalyticsCategoryFilterProps {
  value: string;
  onChange: (v: string) => void;
  categories: string[];
}

export const AnalyticsCategoryFilter: React.FC<AnalyticsCategoryFilterProps> = ({ value, onChange, categories }) => (
  <label style={{ marginRight: 12 }}>
    Categoría:
    <select value={value} onChange={e => onChange(e.target.value)} style={{ marginLeft: 4 }}>
      <option value="">Todas</option>
      {categories.map(c => (
        <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>
      ))}
    </select>
  </label>
);
