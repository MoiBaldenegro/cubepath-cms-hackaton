export class TestimonialNotFoundError extends Error {
  constructor(id: string) {
    super(`Testimonial with id ${id} not found`);
    this.name = 'TestimonialNotFoundError';
  }
}
