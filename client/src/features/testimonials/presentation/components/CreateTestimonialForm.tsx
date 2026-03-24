import React, { useState } from 'react';
import { TestimonialCategory, TestimonialTag } from '../../domain/Testimonial';
import { TestimonialService } from '../../infrastructure/TestimonialService';

export const CreateTestimonialForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState<TestimonialCategory>(TestimonialCategory.TECHNOLOGY);
  const [tags, setTags] = useState<TestimonialTag[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateIdempotencyKey = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback UUID v4 generator
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
      await TestimonialService.create({ 
        author, 
        content, 
        rating,
        category,
        tags,
        iKey: generateIdempotencyKey(),
        imageUrl: imageUrl || undefined,
        videoUrl: videoUrl || undefined,
      });
      setAuthor('');
      setContent('');
      setRating(5);
      setCategory(TestimonialCategory.TECHNOLOGY);
      setTags([]);
      setImageUrl('');
      setVideoUrl('');
      onSuccess();
      alert('Testimonial created successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to create testimonial');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Create New Testimonial</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Author:</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            style={{ display: 'block', width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as TestimonialCategory)}
            required
            style={{ display: 'block', width: '100%' }}
          >
            {Object.values(TestimonialCategory).map((c) => (
              <option key={c} value={c}>
                {c.charAt(0) + c.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Tags:</label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {Object.values(TestimonialTag).map((tag) => (
              <label key={tag} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  type="checkbox"
                  checked={tags.includes(tag)}
                  onChange={() => handleTagChange(tag)}
                />
                {tag.charAt(0) + tag.slice(1).toLowerCase()}
              </label>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Image URL (Optional):</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            style={{ display: 'block', width: '100%' }}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Video URL (Optional):</label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            style={{ display: 'block', width: '100%' }}
            placeholder="https://example.com/video.mp4"
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            style={{ display: 'block', width: '100%', minHeight: '80px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Rating:</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            style={{ display: 'block', width: '100%' }}
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r} Stars
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Testimonial'}
        </button>
      </form>
    </div>
  );
};