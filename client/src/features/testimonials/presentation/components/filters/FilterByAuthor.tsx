import React from 'react';

interface FilterByAuthorProps {
  value: string;
  onChange: (value: string) => void;
  authors: string[];
}

export const FilterByAuthor: React.FC<FilterByAuthorProps> = ({ value, onChange, authors }) => (
  <div style={{ minWidth: 120 }}>
    <label style={{ fontWeight: 600, fontSize: 13 }}>Autor:</label>
    <select value={value} onChange={e => onChange(e.target.value)} style={{ width: '100%', padding: 6, borderRadius: 6 }}>
      <option value="">Todos</option>
      {authors.map(author => (
        <option key={author} value={author}>{author}</option>
      ))}
    </select>
  </div>
);