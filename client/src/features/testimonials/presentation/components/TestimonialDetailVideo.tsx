import React from 'react';

export interface TestimonialDetailVideoProps {
  videoUrl: string;
  alt?: string;
}

export const TestimonialDetailVideo: React.FC<TestimonialDetailVideoProps> = ({ videoUrl, alt }) => {
  // Extract YouTube video ID
  let embedUrl = '';
  const ytMatch = videoUrl.match(
    /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/watch\?v=|youtu.be\/)([\w-]{11})/
  );
  if (ytMatch) {
    embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
  }

  return embedUrl ? (
    <div style={{ textAlign: 'center', marginBottom: 32 }}>
      <iframe
        width="360"
        height="215"
        src={embedUrl}
        title={alt || 'Video del testimonio'}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ borderRadius: 16, boxShadow: '0 2px 12px #0001', background: '#000' }}
      />
    </div>
  ) : (
    <div style={{ color: '#888', fontSize: 14, marginBottom: 24 }}>
      Video no disponible o URL inválida
    </div>
  );
};
