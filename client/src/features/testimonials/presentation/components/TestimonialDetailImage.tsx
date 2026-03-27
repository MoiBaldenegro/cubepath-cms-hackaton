import React, { useState } from 'react';

export interface TestimonialDetailImageProps {
  imageUrl: string;
  alt?: string;
}

export const TestimonialDetailImage: React.FC<TestimonialDetailImageProps> = ({ imageUrl, alt }) => {
  const [zoom, setZoom] = useState(false);
  return (
    <div style={{ textAlign: 'center', marginBottom: 32 }}>
      <img
        src={imageUrl}
        alt={alt || 'Imagen del testimonio'}
        style={{
          maxWidth: zoom ? '90vw' : 320,
          maxHeight: zoom ? '90vh' : 320,
          borderRadius: 16,
          border: '2px solid #eee',
          boxShadow: zoom ? '0 8px 32px #0005' : '0 2px 12px #0001',
          cursor: 'zoom-in',
          transition: 'all 0.2s',
          zIndex: zoom ? 1001 : 1,
          position: zoom ? 'fixed' : 'static',
          top: zoom ? '50%' : undefined,
          left: zoom ? '50%' : undefined,
          transform: zoom ? 'translate(-50%, -50%) scale(1.1)' : undefined,
          background: '#fff',
        }}
        onClick={() => setZoom(!zoom)}
      />
      {zoom && (
        <div
          onClick={() => setZoom(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.6)',
            zIndex: 1000,
            cursor: 'zoom-out',
          }}
        />
      )}
      <div style={{ fontSize: 13, color: '#888', marginTop: 8 }}>
        Haz click para {zoom ? 'cerrar' : 'ampliar'}
      </div>
    </div>
  );
};
