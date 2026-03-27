
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Testimonial } from '../../domain/Testimonial';
import { findTestimonialById } from '../../infrastructure/TestimonialService';
import { TestimonialDetailImage } from '../components/TestimonialDetailImage';
import { TestimonialMeta } from '../components/TestimonialMeta';
import { TestimonialDetailVideo } from '../components/TestimonialDetailVideo';


export const TestimonialDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // UX: Copiar contenido
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

  if (loading) return <div>Cargando...</div>;
  if (error || !testimonial) return <div style={{color:'red'}}>{error || 'Testimonio no encontrado.'}</div>;


  const handleCopy = () => {
    if (testimonial) {
      navigator.clipboard.writeText(`"${testimonial.content}" — ${testimonial.author}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  // UX: Compartir (si está disponible)
  const handleShare = () => {
    if (navigator.share && testimonial) {
      navigator.share({
        title: `Testimonio de ${testimonial.author}`,
        text: `"${testimonial.content}" — ${testimonial.author}`,
        url: window.location.href,
      });
    }
  };

  // Social share URLs (solo si hay video)
  let twitterUrl = '';
  let facebookUrl = '';
  let linkedinUrl = '';
  let whatsappUrl = '';
  let shareText = '';
  let shareUrl = '';
  if (testimonial.videoUrl) {
    shareText = encodeURIComponent(`"${testimonial.content}" — ${testimonial.author}`);
    shareUrl = encodeURIComponent(testimonial.videoUrl);
    twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
    facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
    linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareText}`;
    whatsappUrl = `https://wa.me/?text=${shareText}%20${shareUrl}`;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #f8fafc 0%, #e0e7ef 100%)', padding: '0 0 60px 0' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', background: '#fff', borderRadius: 18, boxShadow: '0 4px 32px #0002', padding: 40, marginTop: 48 }}>
        <button onClick={() => navigate(-1)} style={{ marginBottom: 32, background: 'none', border: 'none', color: '#3b82f6', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>&larr; Volver</button>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {testimonial.imageUrl && (
            <TestimonialDetailImage imageUrl={testimonial.imageUrl} alt={testimonial.author} />
          )}
          <div style={{ flex: 1, minWidth: 260 }}>
            <h1 style={{ marginBottom: 12, fontSize: 32, fontWeight: 700 }}>{testimonial.author}</h1>
            <div style={{ marginBottom: 18, color: '#f59e0b', fontSize: 26 }}>
              {'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}
            </div>
            <blockquote style={{ fontSize: 22, fontStyle: 'italic', marginBottom: 32, color: '#222', background: '#f3f4f6', borderLeft: '4px solid #3b82f6', padding: '18px 24px', borderRadius: 8 }}>
              {testimonial.content}
            </blockquote>
            <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center' }}>
              <button onClick={handleCopy} style={{ background: '#e0e7ef', border: 'none', borderRadius: 6, padding: '8px 18px', cursor: 'pointer', color: '#222', fontWeight: 500 }}>
                {copied ? '¡Copiado!' : 'Copiar texto'}
              </button>
              {testimonial.videoUrl && (
                <>
                  {typeof navigator.share === 'function' && (
                    <button onClick={handleShare} style={{ background: '#e0e7ef', border: 'none', borderRadius: 6, padding: '8px 18px', cursor: 'pointer', color: '#222', fontWeight: 500 }}>
                      Compartir
                    </button>
                  )}
                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ background: '#1da1f2', color: '#fff', borderRadius: 6, padding: '8px 12px', textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center' }}
                    title="Compartir en Twitter"
                  >
                    <span role="img" aria-label="Twitter" style={{ marginRight: 6 }}>🐦</span> Twitter
                  </a>
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ background: '#1877f3', color: '#fff', borderRadius: 6, padding: '8px 12px', textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center' }}
                    title="Compartir en Facebook"
                  >
                    <span role="img" aria-label="Facebook" style={{ marginRight: 6 }}>📘</span> Facebook
                  </a>
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ background: '#0a66c2', color: '#fff', borderRadius: 6, padding: '8px 12px', textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center' }}
                    title="Compartir en LinkedIn"
                  >
                    <span role="img" aria-label="LinkedIn" style={{ marginRight: 6 }}>💼</span> LinkedIn
                  </a>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ background: '#25d366', color: '#fff', borderRadius: 6, padding: '8px 12px', textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center' }}
                    title="Compartir en WhatsApp"
                  >
                    <span role="img" aria-label="WhatsApp" style={{ marginRight: 6 }}>💬</span> WhatsApp
                  </a>
                </>
              )}
            </div>
            {testimonial.videoUrl && (
              <TestimonialDetailVideo videoUrl={testimonial.videoUrl} alt={testimonial.author} />
            )}
            <TestimonialMeta testimonial={testimonial} />
          </div>
        </div>
      </div>
    </div>
  );
};
