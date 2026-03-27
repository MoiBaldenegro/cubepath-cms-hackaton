import { useEffect, useState } from 'react';

import { TestimonialStatus, type Testimonial } from '../../domain/Testimonial';
import { TestimonialService } from '../../infrastructure/TestimonialService';
import { TestimonialListVideoCell } from './TestimonialListVideoCell';

export const TestimonialList = ({ isAdmin }: { isAdmin: boolean }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const data = await TestimonialService.findAll();
      // Ensure data is mapped correctly if needed, or assume backend returns matches
      setTestimonials(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await TestimonialService.approve(id);
      setTestimonials((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: TestimonialStatus.APPROVED } : t))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to approve');
    }
  };

  const handleRemove = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await TestimonialService.remove(id);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to remove');
    }
  };

  if (loading) return <p>Loading testimonials...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h3>All Testimonials</h3>
      {testimonials.length === 0 ? (
        <p>No testimonials found.</p>
      ) : (
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
            {testimonials.map((t) => (
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
                <td style={{ padding: '8px' }}>
                  <button
                    style={{ background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer' }}
                    onClick={() => window.location.assign(`/testimonials/${t.id}`)}
                  >
                    Ver detalles
                  </button>
                </td>
                {isAdmin && (
                  <td style={{ padding: '8px' }}>
                    {t.status !== TestimonialStatus.APPROVED && (
                      <button
                        onClick={() => handleApprove(t.id)}
                        style={{ marginRight: '5px', backgroundColor: '#28a745', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                      >
                        Aprobar
                      </button>
                    )}
                    <button
                      onClick={() => handleRemove(t.id)}
                      style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                    >
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};