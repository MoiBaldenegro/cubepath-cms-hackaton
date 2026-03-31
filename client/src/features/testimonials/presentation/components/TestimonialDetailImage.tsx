import { useState } from 'react';
import styles from './TestimonialDetailImage.module.css';

export interface TestimonialDetailImageProps {
  imageUrl: string;
  alt?: string;
}

export const TestimonialDetailImage: React.FC<TestimonialDetailImageProps> = ({ imageUrl, alt }) => {
  const [zoom, setZoom] = useState(false);
  
  return (
    <div className={styles.container}>
      {zoom && (
        <div className={styles.overlay} onClick={() => setZoom(false)} />
      )}
      <img
        src={imageUrl}
        alt={alt || 'Imagen del testimonio'}
        className={`${styles.image} ${zoom ? styles.zoomed : ''}`}
        onClick={() => setZoom(!zoom)}
      />
      <div className={styles.hint}>
        Haz click para {zoom ? 'cerrar' : 'ampliar'}
      </div>
    </div>
  );
};
