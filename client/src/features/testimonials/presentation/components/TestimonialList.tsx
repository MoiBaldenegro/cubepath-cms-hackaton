import { useEffect, useState } from 'react';
import { TestimonialStatus, type Testimonial } from '../../domain/Testimonial';
import { TestimonialService } from '../../infrastructure/TestimonialService';
import { TestimonialListVideoCell } from './TestimonialListVideoCell';
import styles from './TestimonialList.module.css';

interface TestimonialListProps {
  isAdmin: boolean;
}

function TestimonialList({ isAdmin }: TestimonialListProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState('');

  useEffect(() => {
    TestimonialService.findAll()
      .then((data) => {
        setTestimonials(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error al cargar testimonios');
        setLoading(false);
      });
  }, []);

  const authors = Array.from(new Set(testimonials.map(t => t.author))).filter(Boolean);
  const filtered = testimonials.filter(t => {
    if (status && t.status !== status) return false;
    if (author && t.author !== author) return false;
    if (rating && String(t.rating) !== rating) return false;
    return true;
  });

  const handleApprove = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      await TestimonialService.approve(id);
      const updated = testimonials.map(t => t.id === id ? { ...t, status: TestimonialStatus.APPROVED } : t);
      setTestimonials(updated);
    } catch {
      setError('Error al aprobar testimonio');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      await TestimonialService.remove(id);
      setTestimonials(testimonials.filter(t => t.id !== id));
    } catch {
      setError('Error al eliminar testimonio');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Cargando testimonios...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  const statusLabels: Record<string, string> = {
    APPROVED: 'Aprobado',
    PENDING: 'Pendiente',
    REJECTED: 'Rechazado',
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Todos los testimonios</h3>
        <div className={styles.filters}>
          <select
            className={styles.filterSelect}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Todos los estados</option>
            {Object.values(TestimonialStatus).map((s) => (
              <option key={s} value={s}>{statusLabels[s]}</option>
            ))}
          </select>
          <select
            className={styles.filterSelect}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          >
            <option value="">Todos los autores</option>
            {authors.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <select
            className={styles.filterSelect}
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="">Todas las calificaciones</option>
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{r} estrellas</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>💬</div>
          <p className={styles.emptyText}>No se encontraron testimonios</p>
        </div>
      ) : (
        <>
          {filtered[0]?.aiGenerated && (
            <div className={styles.aiCard}>
              <div className={styles.aiCardHeader}>
                <span className={styles.aiBadge}>✨ Generado por IA</span>
              </div>
              <p className={styles.aiCardContent}>"{filtered[0].content}"</p>
              <div className={styles.aiCardAuthor}>
                <span style={{ fontWeight: 500 }}>{filtered[0].author}</span>
                <span className={styles.rating}>
                  {'★'.repeat(filtered[0].rating || 0)}{'☆'.repeat(5 - (filtered[0].rating || 0))}
                </span>
              </div>
            </div>
          )}

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Video</th>
                  <th>Autor</th>
                  <th>Contenido</th>
                  <th>Calificación</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                  {isAdmin && <th>Admin</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id}>
                    <td>
                      {t.imageUrl ? (
                        <img src={t.imageUrl} alt="Testimonio" className={styles.cellImage} />
                      ) : (
                        <span style={{ color: 'var(--foreground-muted)', fontSize: '0.75rem' }}>Sin imagen</span>
                      )}
                    </td>
                    <td>
                      <div className={styles.cellVideo}>
                        <TestimonialListVideoCell videoUrl={t.videoUrl} />
                      </div>
                    </td>
                    <td className={styles.cellAuthor}>
                      <span className={styles.cellAuthorName}>{t.author}</span>
                      <span className={styles.cellAuthorMeta}>{t.category}</span>
                    </td>
                    <td className={styles.cellContent}>{t.content}</td>
                    <td>
                      <span className={styles.rating}>
                        {'★'.repeat(t.rating || 0)}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[t.status.toLowerCase()]}`}>
                        <span className={styles.statusDot}></span>
                        {statusLabels[t.status] || t.status}
                      </span>
                    </td>
                    <td>
                      <a href={`/testimonials/${t.id}`} target="_blank" rel="noopener noreferrer" className={styles.viewBtn}>
                        Ver ↗
                      </a>
                    </td>
                    {isAdmin && (
                      <td>
                        <div className={styles.actions}>
                          {t.status !== TestimonialStatus.APPROVED && (
                            <button onClick={() => handleApprove(t.id)} className={`${styles.actionBtn} ${styles.approveBtn}`}>
                              Aprobar
                            </button>
                          )}
                          <button onClick={() => handleRemove(t.id)} className={`${styles.actionBtn} ${styles.deleteBtn}`}>
                            Eliminar
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export { TestimonialList };
