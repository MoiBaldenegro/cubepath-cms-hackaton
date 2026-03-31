import type { Testimonial } from '../../domain/Testimonial';
import styles from './TestimonialMeta.module.css';

interface TestimonialMetaProps {
  testimonial: Testimonial;
}

export const TestimonialMeta: React.FC<TestimonialMetaProps> = ({ testimonial }) => {
  const categoryLabels: Record<string, string> = {
    TECHNOLOGY: 'Tecnología',
    HEALTHCARE: 'Salud',
    EDUCATION: 'Educación',
    FINANCE: 'Finanzas',
    RETAIL: 'Comercio',
    OTHER: 'Otro',
  };

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <span className={styles.label}>Categoría</span>
        <span className={styles.value}>
          {categoryLabels[testimonial.category] || testimonial.category}
        </span>
      </div>

      {testimonial.tags && testimonial.tags.length > 0 && (
        <div className={styles.item}>
          <span className={styles.label}>Etiquetas</span>
          <div className={styles.tags}>
            {testimonial.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag.charAt(0) + tag.slice(1).toLowerCase()}
              </span>
            ))}
          </div>
        </div>
      )}

      {testimonial.createdAt && (
        <div className={styles.item}>
          <span className={styles.label}>Fecha</span>
          <span className={styles.value}>
            {new Date(testimonial.createdAt).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
      )}

      {testimonial.isEdited && (
        <div className={styles.editedBadge}>
          ✏️ Editado
        </div>
      )}

      <div className={styles.item}>
        <span className={styles.label}>Estado</span>
        <span className={`${styles.statusBadge} ${testimonial.status === 'APPROVED' ? 'approved' : 'pending'}`}
          style={{
            background: testimonial.status === 'APPROVED' 
              ? 'var(--semantic-success-light)' 
              : 'var(--semantic-warning-light)',
            color: testimonial.status === 'APPROVED' 
              ? 'var(--semantic-success)' 
              : 'var(--semantic-warning)',
            padding: '0.25rem 0.625rem',
            borderRadius: '100px',
            fontSize: '0.75rem',
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
          }}
        >
          <span style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'currentColor',
          }}></span>
          {testimonial.status === 'APPROVED' ? 'Aprobado' : 'Pendiente'}
        </span>
      </div>
    </div>
  );
};
