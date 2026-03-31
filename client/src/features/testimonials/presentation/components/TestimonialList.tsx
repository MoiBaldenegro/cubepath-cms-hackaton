
import { useEffect, useState } from 'react';
import { TestimonialStatus, type Testimonial } from '../../domain/Testimonial';
import { TestimonialService } from '../../infrastructure/TestimonialService';
import { TestimonialListVideoCell } from './TestimonialListVideoCell';
import { FilterByStatus } from './filters/FilterByStatus';
import { FilterByAuthor } from './filters/FilterByAuthor';
import { FilterByRating } from './filters/FilterByRating';
import { FilterByCategory } from './filters/FilterByCategory';
import { FilterByMedia } from './filters/FilterByMedia';
import { TestimonialAnalyticsTable } from '../../../dashboard/presentation/components/TestimonialAnalyticsTable';

function TestimonialList({ isAdmin }: { isAdmin: boolean }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState('');
  const [category, setCategory] = useState('');
  const [media, setMedia] = useState('');

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
    if (category && t.category !== category) return false;
    if (media && ((media === 'image' && !t.imageUrl) || (media === 'video' && !t.videoUrl))) return false;
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

  if (loading) return <div>Cargando testimonios...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h3>All Testimonials</h3>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', margin: '18px 0 24px 0', alignItems: 'flex-end' }}>
        <FilterByStatus value={status} onChange={setStatus} />
        <FilterByAuthor value={author} onChange={setAuthor} authors={authors} />
        <FilterByRating value={rating} onChange={setRating} />
        <FilterByCategory value={category} onChange={setCategory} />
        <FilterByMedia value={media} onChange={setMedia} />
      </div>
      {filtered.length === 0 ? (
        <p>No testimonials found.</p>
      ) : (
        <>
          {/* Mostrar testimonio AI si existe y es el primero */}
          {filtered[0]?.aiGenerated && (
            <div style={{
              background: 'linear-gradient(90deg, #f8fafc 60%, #e0e7ef 100%)',
              border: '2px dashed #6b7280',
              borderRadius: 10,
              padding: 18,
              marginBottom: 18,
              position: 'relative',
              boxShadow: '0 2px 8px #e0e7ef',
            }}>
              <div style={{ position: 'absolute', top: 8, right: 16, color: '#64748b', fontWeight: 600, fontSize: 13, opacity: 0.7 }}>
                <span style={{ background: '#e0e7ef', borderRadius: 4, padding: '2px 8px' }}>Generado por AI</span>
              </div>
              <div style={{ fontSize: 17, fontStyle: 'italic', marginBottom: 8 }}>
                "{filtered[0].content}"
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontWeight: 600 }}>{filtered[0].author}</span>
                <span style={{ color: '#f59e42', fontSize: 18 }}>{'★'.repeat(filtered[0].rating || 0)}{'☆'.repeat(5 - (filtered[0].rating || 0))}</span>
              </div>
            </div>
          )}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                <th style={{ padding: '8px' }}>Imagen</th>
                <th style={{ padding: '8px' }}>Video</th>
                <th style={{ padding: '8px' }}>Autor</th>
                <th style={{ padding: '8px' }}>Contenido</th>
                <th style={{ padding: '8px' }}>Calificación</th>
                <th style={{ padding: '8px' }}>Estado</th>
                <th style={{ padding: '8px' }}>Ver detalles</th>
                {isAdmin && <th style={{ padding: '8px' }}>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px', textAlign: 'center' }}>
                    {t.imageUrl ? (
                      <img src={t.imageUrl} alt="Testimonial" style={{ maxWidth: '80px', maxHeight: '80px', borderRadius: '8px', border: '1px solid #eee' }} />
                    ) : (
                      <span style={{ color: '#bbb', fontSize: '12px' }}>Sin imagen</span>
                    )}
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>
                    <TestimonialListVideoCell videoUrl={t.videoUrl} />
                  </td>
                  <td style={{ padding: '8px' }}>{t.author}</td>
                  <td style={{ padding: '8px' }}>{t.content}</td>
                  <td style={{ padding: '8px' }}>{t.rating} ★</td>
                  <td style={{ padding: '8px' }}>{t.status}</td>
                  <td style={{ padding: '8px' }}>
                    <a href={`/testimonials/${t.id}`} target="_blank" rel="noopener noreferrer">Ver</a>
                  </td>
                  {isAdmin && (
                    <td style={{ padding: '8px' }}>
                      {t.status !== TestimonialStatus.APPROVED && (
                        <button onClick={() => handleApprove(t.id)} style={{ marginRight: 8 }}>Aprobar</button>
                      )}
                      <button onClick={() => handleRemove(t.id)} style={{ color: '#ef4444' }}>Eliminar</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {isAdmin && filtered.length > 0 && (
            <TestimonialAnalyticsTable organizationId={filtered[0].organizationId} testimonials={filtered} />
          )}
        </>
      )}
    </div>
  );
}

export { TestimonialList };