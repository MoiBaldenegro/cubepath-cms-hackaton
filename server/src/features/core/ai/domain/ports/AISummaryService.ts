export interface AISummaryService {
  summarizeTestimonials(testimonials: string[]): Promise<string>;
}
