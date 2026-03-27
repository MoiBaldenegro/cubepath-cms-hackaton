import React from 'react';
import { TestimonialStatus } from '../../../domain/Testimonial';

interface FilterByStatusProps {
  value: string;
  onChange: (value: string) => void;
}

export const FilterByStatus: React.FC<FilterByStatusProps> = ({ value, onChange }) => (
  <div style={{ minWidth: 120 }}>
    <label style={{ fontWeight: 600, fontSize: 13 }}>Estado:</label>
    <select value={value} onChange={e => onChange(e.target.value)} style={{ width: '100%', padding: 6, borderRadius: 6 }}>
      <option value="">Todos</option>
      {Object.values(TestimonialStatus).map(status => (
        <option key={status} value={status}>{status.charAt(0) + status.slice(1).toLowerCase()}</option>
      ))}
    </select>
  </div>
);