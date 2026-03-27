import React from 'react';
import type { Testimonial } from '../../domain/Testimonial';

interface TestimonialMetaProps {
  testimonial: Testimonial;
}

export const TestimonialMeta: React.FC<TestimonialMetaProps> = ({ testimonial }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'row',
    gap: 32,
    marginTop: 24,
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
    color: '#555',
    fontSize: 15,
  }}>
    <div>
      <strong>Categoría:</strong> {testimonial.category}
    </div>
    <div>
      <strong>Tags:</strong> {testimonial.tags?.join(', ') || 'Ninguno'}
    </div>
    {testimonial.createdAt && (
      <div>
        <strong>Fecha:</strong> {new Date(testimonial.createdAt).toLocaleDateString()}
      </div>
    )}
    {testimonial.isEdited && (
      <div style={{ color: '#f59e0b' }}>
        (Editado)
      </div>
    )}
    <div style={{ color: testimonial.status === 'APPROVED' ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
      {testimonial.status === 'APPROVED' ? 'Aprobado' : 'Pendiente'}
    </div>
  </div>
);
