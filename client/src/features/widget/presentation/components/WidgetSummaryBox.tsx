import { useEffect, useState } from 'react';
import styles from './WidgetTestimonials.module.css';
import { TestimonialService } from '../../../testimonials/infrastructure/TestimonialService';

export const WidgetSummaryBox = () => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    // Llama al endpoint de resumen AI
    TestimonialService.getSummary()
      .then((res) => {
        setSummary(res.summary || '');
      })
      .catch(() => setError('No se pudo cargar el resumen AI.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.summaryBox}>
      <h3>Resumen de testimonios (IA)</h3>
      {loading ? (
        <div className={styles.skeleton}>Cargando resumen...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <div className={styles.summaryText}>{summary}</div>
      )}
    </div>
  );
};
