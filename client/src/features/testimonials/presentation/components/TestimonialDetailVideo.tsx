import styles from './TestimonialDetailVideo.module.css';

export interface TestimonialDetailVideoProps {
  videoUrl: string;
  alt?: string;
}

export const TestimonialDetailVideo: React.FC<TestimonialDetailVideoProps> = ({ videoUrl, alt }) => {
  let embedUrl = '';
  const ytMatch = videoUrl.match(
    /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/watch\?v=|youtu.be\/)([\w-]{11})/
  );
  if (ytMatch) {
    embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
  }

  return embedUrl ? (
    <div className={styles.container}>
      <iframe
        className={styles.video}
        src={embedUrl}
        title={alt || 'Video del testimonio'}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  ) : (
    <div className={styles.unavailable}>
      Video no disponible o URL inválida
    </div>
  );
};
