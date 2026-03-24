import React, { useEffect, useState } from 'react';
import { TestimonialStatus, type Testimonial } from '../../domain/Testimonial';
import { TestimonialService } from '../../infrastructure/TestimonialService';

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
              <th style={{ padding: '8px' }}>Author</th>
              <th style={{ padding: '8px' }}>Content</th>
              <th style={{ padding: '8px' }}>Rating</th>
              <th style={{ padding: '8px' }}>Status</th>
              {isAdmin && <th style={{ padding: '8px' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {testimonials.map((t) => (
              <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>{t.author}</td>
                <td style={{ padding: '8px' }}>{t.content}</td>
                <td style={{ padding: '8px' }}>{t.rating} ★</td>
                <td style={{ padding: '8px' }}>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: t.status === TestimonialStatus.APPROVED ? '#d4edda' : '#fff3cd',
                      color: t.status === TestimonialStatus.APPROVED ? '#155724' : '#856404',
                    }}
                  >
                    {t.status}
                  </span>
                </td>
                {isAdmin && (
                  <td style={{ padding: '8px' }}>
                    {t.status !== TestimonialStatus.APPROVED && (
                      <button
                        onClick={() => handleApprove(t.id)}
                        style={{ marginRight: '5px', backgroundColor: '#28a745', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleRemove(t.id)}
                      style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                    >
                      Delete
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