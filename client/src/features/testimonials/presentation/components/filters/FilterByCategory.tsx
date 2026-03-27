import React from 'react';
import { TestimonialCategory } from '../../../domain/Testimonial';

interface FilterByCategoryProps {
  value: string;
  onChange: (value: string) => void;
}

export const FilterByCategory: React.FC<FilterByCategoryProps> = ({ value, onChange }) => (
  <div style={{ minWidth: 120 }}>
    <label style={{ fontWeight: 600, fontSize: 13 }}>Categoría:</label>
    <select value={value} onChange={e => onChange(e.target.value)} style={{ width: '100%', padding: 6, borderRadius: 6 }}>
      <option value="">Todas</option>
      {Object.values(TestimonialCategory).map(category => (
        <option key={category} value={category}>{category.charAt(0) + category.slice(1).toLowerCase()}</option>
      ))}
    </select>
  </div>
);