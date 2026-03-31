import { useEffect, useState } from 'react';
import styles from './WidgetSummaryBox.module.css';
import { TestimonialService } from '../../../testimonials/infrastructure/TestimonialService';

const TestimoLogo = () => (
  <svg width="18" height="18" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="notif_grad_wm" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38bdf8"/>
        <stop offset="100%" stopColor="#2563eb"/> 
      </linearGradient>
      <mask id="cutout-mask-wm">
        <rect width="100%" height="100%" fill="white"/>
        <circle cx="416" cy="112" r="80" fill="black"/>
      </mask>
    </defs>
    <rect x="64" y="80" width="384" height="160" rx="80" fill="#18181B"/>
    <rect x="176" y="208" width="160" height="256" rx="80" fill="#18181B"/>
    <circle cx="416" cy="112" r="80" fill="#18181B"/>
    <rect x="96" y="112" width="320" height="96" rx="48" fill="white" mask="url(#cutout-mask-wm)"/>
    <rect x="208" y="240" width="96" height="192" rx="48" fill="white"/>
    <circle cx="416" cy="112" r="48" fill="url(#notif_grad_wm)"/>
  </svg>
);

export const WidgetSummaryBox = () => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    TestimonialService.getSummary()
      .then((res) => {
        if (!cancelled) {
          setSummary(res.summary || '');
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('No se pudo cargar el resumen AI.');
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={styles.summaryBox}>
      <div className={styles.watermark}>
        <div className={styles.watermarkLeft}>
          <span className={styles.aiBadge}>
            <span className={styles.aiIcon}>✨</span>
            Generado con AI
          </span>
        </div>
        <div className={styles.watermarkRight}>
          <TestimoLogo />
          <span className={styles.brandName}>Testimo</span>
        </div>
      </div>
      <h3 className={styles.title}>Resumen de testimonios</h3>
      {loading ? (
        <div className={styles.skeleton}>Cargando resumen...</div>
      ) : error ? (
        <div className={styles.errorText}>{error}</div>
      ) : (
        <div className={styles.summaryText}>{summary}</div>
      )}
    </div>
  );
};
