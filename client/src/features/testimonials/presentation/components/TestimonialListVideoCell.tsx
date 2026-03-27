import React from 'react';

export const TestimonialListVideoCell: React.FC<{ videoUrl?: string }> = ({ videoUrl }) => {
  if (!videoUrl) return <span style={{ color: '#bbb', fontSize: '12px' }}>Sin video</span>;
  // Extraer ID de YouTube
  const ytMatch = videoUrl.match(
    /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/watch\?v=|youtu.be\/)([\w-]{11})/
  );
  if (ytMatch) {
    const thumb = `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
    return (
      <a href={videoUrl} target="_blank" rel="noopener noreferrer" title="Ver video en YouTube">
        <img src={thumb} alt="Miniatura video" style={{ maxWidth: 80, maxHeight: 60, borderRadius: 6, border: '1px solid #eee' }} />
      </a>
    );
  }
  return <span style={{ color: '#bbb', fontSize: '12px' }}>URL inválida</span>;
};
