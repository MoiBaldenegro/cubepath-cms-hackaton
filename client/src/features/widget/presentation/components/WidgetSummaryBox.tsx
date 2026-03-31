import { useEffect, useState } from 'react';
import styles from './WidgetSummaryBox.module.css';
import { TestimonialService } from '../../../testimonials/infrastructure/TestimonialService';

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
      <h3>Resumen de testimonios (IA)</h3>
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
