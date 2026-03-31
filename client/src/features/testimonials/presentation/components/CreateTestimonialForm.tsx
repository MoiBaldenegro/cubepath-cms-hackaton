import React, { useState, useRef } from 'react';
import { TestimonialCategory, TestimonialTag } from '../../domain/Testimonial';
import { TestimonialService } from '../../infrastructure/TestimonialService';
import styles from './CreateTestimonialForm.module.css';

interface TestimonialInput {
  author: string;
  content: string;
  rating: number;
  category: TestimonialCategory;
  tags: TestimonialTag[];
  iKey: string;
  imageUrl?: string;
  imageFile?: File | null;
  videoUrl?: string;
}

export const CreateTestimonialForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState<TestimonialCategory>(TestimonialCategory.TECHNOLOGY);
  const [tags, setTags] = useState<TestimonialTag[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateIdempotencyKey = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const handleTagChange = (tag: TestimonialTag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const testimonialData: TestimonialInput & { imageFile?: File | null } = {
        author,
        content,
        rating,
        category,
        tags,
        iKey: generateIdempotencyKey(),
        imageFile: imageFile || undefined,
      };
      if (imageUrl) testimonialData.imageUrl = imageUrl;
      if (videoUrl) testimonialData.videoUrl = videoUrl;
      await TestimonialService.create(testimonialData);
      setAuthor('');
      setContent('');
      setRating(5);
      setCategory(TestimonialCategory.TECHNOLOGY);
      setTags([]);
      setImageUrl('');
      setImageFile(null);
      setImagePreview(null);
      setVideoUrl('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      onSuccess();
      alert('¡Testimonio creado exitosamente!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear el testimonio';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const categoryLabels: Record<string, string> = {
    TECHNOLOGY: 'Tecnología',
    HEALTHCARE: 'Salud',
    EDUCATION: 'Educación',
    FINANCE: 'Finanzas',
    RETAIL: 'Comercio',
    OTHER: 'Otro',
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <h3 className={styles.formTitle}>Crear Nuevo Testimonio</h3>
        <p className={styles.formSubtitle}>Completa los detalles del testimonio del cliente</p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Autor</label>
            <input
              type="text"
              className={styles.input}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Nombre del cliente"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Categoría</label>
            <select
              className={`${styles.input} ${styles.select}`}
              value={category}
              onChange={(e) => setCategory(e.target.value as TestimonialCategory)}
              required
            >
              {Object.values(TestimonialCategory).map((c) => (
                <option key={c} value={c}>
                  {categoryLabels[c] || c}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Calificación</label>
            <div className={styles.ratingContainer}>
              <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((r) => (
                  <span
                    key={r}
                    className={`${styles.star} ${r <= rating ? styles.active : ''}`}
                    onClick={() => setRating(r)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Etiquetas</label>
          <div className={styles.tagsContainer}>
            {Object.values(TestimonialTag).map((tag) => (
              <label
                key={tag}
                className={`${styles.tagOption} ${tags.includes(tag) ? styles.selected : ''}`}
              >
                <input
                  type="checkbox"
                  className={styles.tagCheckbox}
                  checked={tags.includes(tag)}
                  onChange={() => handleTagChange(tag)}
                />
                {tag.charAt(0) + tag.slice(1).toLowerCase()}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Contenido</label>
          <textarea
            className={`${styles.input} ${styles.textarea}`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe el testimonio del cliente..."
            required
          />
        </div>

        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Imagen (opcional)</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className={styles.fileInput}
              onChange={handleImageChange}
            />
            <div 
              className={`${styles.fileUploadArea} ${imagePreview ? styles.hasFile : ''}`}
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className={styles.imagePreviewContainer}>
                  <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                  <button 
                    type="button"
                    className={styles.removeImageBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <div className={styles.fileUploadIcon}>📷</div>
                  <div className={styles.fileUploadText}>Haz clic para subir una imagen</div>
                  <div className={styles.fileUploadHint}>PNG, JPG o WEBP (máx. 5MB)</div>
                </>
              )}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>URL de Video (opcional)</label>
            <input
              type="url"
              className={styles.input}
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://ejemplo.com/video.mp4"
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Creando...' : 'Crear Testimonio'}
          </button>
        </div>
      </form>
    </div>
  );
};
