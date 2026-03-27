import React from 'react';

export interface AnalyticsDateFilterProps {
  from: string;
  to: string;
  setFrom: (v: string) => void;
  setTo: (v: string) => void;
}

export const AnalyticsDateFilter: React.FC<AnalyticsDateFilterProps> = ({ from, to, setFrom, setTo }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
    <label>
      Desde:
      <input type="date" value={from} onChange={e => setFrom(e.target.value)} style={{ marginLeft: 4 }} />
    </label>
    <label>
      Hasta:
      <input type="date" value={to} onChange={e => setTo(e.target.value)} style={{ marginLeft: 4 }} />
    </label>
  </div>
);
