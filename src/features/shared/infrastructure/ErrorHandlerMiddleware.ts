import { Request, Response, NextFunction } from 'express';
import { TestimonialNotFoundError } from '../../core/testimonial/domain/errors/TestimonialNotFoundError';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof TestimonialNotFoundError) {
    res.status(404).json({ error: err.message });
  } else {
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
