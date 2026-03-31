import { AISummaryService } from '../domain/ports/AISummaryService';

export class OpenRouterAISummaryService implements AISummaryService {
  private readonly apiKey: string;
  private readonly apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private readonly model = 'mistralai/mixtral-8x7b'; // Puedes cambiar el modelo si lo deseas

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENROUTER_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('OpenRouter API key is required');
    }
  }

  async summarizeTestimonials(testimonials: string[]): Promise<string> {
    const prompt = `Resume los siguientes testimonios en español, resaltando los puntos clave y el sentimiento general.\n\nTestimonios:\n${testimonials.map((t, i) => `${i + 1}. ${t}`).join('\n')}`;
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://cubepath.com',
          'X-Title': 'CubePath CMS',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'Eres un asistente experto en análisis de texto.',
            },
            { role: 'user', content: prompt },
          ],
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || response.statusText);
      }
      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error: any) {
      throw new Error(
        'Error al resumir testimonios con OpenRouter: ' +
          (error.message || error),
      );
    }
  }
}
