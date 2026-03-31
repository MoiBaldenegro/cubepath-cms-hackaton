import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Testimonial } from '../../domain/Testimonial';
import { findTestimonialById } from '../../infrastructure/TestimonialService';
import { TestimonialDetailImage } from '../components/TestimonialDetailImage';
import { TestimonialMeta } from '../components/TestimonialMeta';
import { TestimonialDetailVideo } from '../components/TestimonialDetailVideo';
import styles from './TestimonialDetailPage.module.css';

export const TestimonialDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    const fetch = async () => {
      setLoading(true);
      try {
        const t = await findTestimonialById(id);
        if (isMounted) setTestimonial(t);
      } catch {
        if (isMounted) setError('No se pudo cargar el testimonio.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetch();
    return () => { isMounted = false; };
  }, [id]);

  if (loading) return (
    <div className={styles.loading}>
      <div className={styles.spinner}></div>
      <span>Cargando...</span>
    </div>
  );
  
  if (error || !testimonial) return (
    <div className={styles.error}>
      {error || 'Testimonio no encontrado.'}
    </div>
  );

  const handleCopy = () => {
    if (testimonial) {
      navigator.clipboard.writeText(`"${testimonial.content}" — ${testimonial.author}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleShare = () => {
    if (navigator.share && testimonial) {
      navigator.share({
        title: `Testimonio de ${testimonial.author}`,
        text: `"${testimonial.content}" — ${testimonial.author}`,
        url: window.location.href,
      });
    }
  };

  let twitterUrl = '';
  let facebookUrl = '';
  let linkedinUrl = '';
  let whatsappUrl = '';
  if (testimonial.videoUrl) {
    const shareText = encodeURIComponent(`"${testimonial.content}" — ${testimonial.author}`);
    const shareUrl = encodeURIComponent(testimonial.videoUrl);
    twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
    facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
    linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareText}`;
    whatsappUrl = `https://wa.me/?text=${shareText}%20${shareUrl}`;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          ← Volver
        </button>

        <div className={styles.content}>
          {testimonial.imageUrl && (
            <div className={styles.imageSection}>
              <TestimonialDetailImage imageUrl={testimonial.imageUrl} alt={testimonial.author} />
            </div>
          )}

          <div className={styles.details}>
            <div className={styles.header}>
              <h1 className={styles.author}>{testimonial.author}</h1>
              <div className={styles.rating}>
                {'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}
              </div>
            </div>

            <blockquote className={styles.quote}>
              {testimonial.content}
            </blockquote>

            <div className={styles.actions}>
              <button 
                onClick={handleCopy} 
                className={`${styles.actionBtn} ${copied ? styles.copied : ''}`}
              >
                {copied ? '✓ ¡Copiado!' : '📋 Copiar texto'}
              </button>

              {testimonial.videoUrl && (
                <>
                  {typeof navigator.share === 'function' && (
                    <button onClick={handleShare} className={`${styles.actionBtn} ${styles.shareBtn}`}>
                      📤 Compartir
                    </button>
                  )}

                  <div className={styles.socialLinks}>
                    <a
                      href={twitterUrl}
                      className={`${styles.socialLink} ${styles.twitter}`}
                      title="Compartir en Twitter"
                    >
                      🐦 Twitter
                    </a>
                    <a
                      href={facebookUrl}
                      className={`${styles.socialLink} ${styles.facebook}`}
                      title="Compartir en Facebook"
                    >
                      📘 Facebook
                    </a>
                    <a
                      href={linkedinUrl}
                      className={`${styles.socialLink} ${styles.linkedin}`}
                      title="Compartir en LinkedIn"
                    >
                      💼 LinkedIn
                    </a>
                    <a
                      href={whatsappUrl}
                      className={`${styles.socialLink} ${styles.whatsapp}`}
                      title="Compartir en WhatsApp"
                    >
                      💬 WhatsApp
                    </a>
                  </div>
                </>
              )}
            </div>

            {testimonial.videoUrl && (
              <div className={styles.videoSection}>
                <TestimonialDetailVideo videoUrl={testimonial.videoUrl} alt={testimonial.author} />
              </div>
            )}

            <TestimonialMeta testimonial={testimonial} />
          </div>
        </div>
      </div>
    </div>
  );
};
