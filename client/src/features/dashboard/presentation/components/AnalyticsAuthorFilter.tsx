import React from 'react';

export interface AnalyticsAuthorFilterProps {
  value: string;
  onChange: (v: string) => void;
  authors: string[];
}

export const AnalyticsAuthorFilter: React.FC<AnalyticsAuthorFilterProps> = ({ value, onChange, authors }) => (
  <label style={{ marginRight: 12 }}>
    Autor:
    <select value={value} onChange={e => onChange(e.target.value)} style={{ marginLeft: 4 }}>
      <option value="">Todos</option>
      {authors.map(a => (
        <option key={a} value={a}>{a}</option>
      ))}
    </select>
  </label>
);
