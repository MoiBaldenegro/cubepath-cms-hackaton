import React from 'react';

export interface AnalyticsStatusFilterProps {
  value: string;
  onChange: (v: string) => void;
  statuses: string[];
}

export const AnalyticsStatusFilter: React.FC<AnalyticsStatusFilterProps> = ({ value, onChange, statuses }) => (
  <label style={{ marginRight: 12 }}>
    Estado:
    <select value={value} onChange={e => onChange(e.target.value)} style={{ marginLeft: 4 }}>
      <option value="">Todos</option>
      {statuses.map(s => (
        <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
      ))}
    </select>
  </label>
);
