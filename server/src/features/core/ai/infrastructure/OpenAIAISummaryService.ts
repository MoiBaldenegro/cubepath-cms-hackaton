import { AISummaryService } from '../domain/ports/AISummaryService';

export class OpenAIAISummaryService implements AISummaryService {
  async summarizeTestimonials(testimonials: string[]): Promise<string> {
    // Aquí iría la integración real con la API de OpenAI o similar
    // Por ahora, solo un mock
    return `Resumen IA: ${testimonials.length} testimonios analizados.`;
  }
}
