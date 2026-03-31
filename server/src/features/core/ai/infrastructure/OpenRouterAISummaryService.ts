import { AISummaryService } from '../domain/ports/AISummaryService';

export class OpenRouterAISummaryService implements AISummaryService {
  private readonly apiKey: string;
  private readonly apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private readonly model = 'openrouter/free'; // Puedes cambiar el modelo si lo deseas

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENROUTER_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('OpenRouter API key is required');
    }
  }

  async summarizeTestimonials(testimonials: string[]): Promise<string> {
    if (!testimonials || testimonials.length === 0) {
      return JSON.stringify({
        content: 'Aún no hay testimonios. ¡Sé el primero en dejar el tuyo!',
        rating: 0,
        author: 'Generado por AI',
        aiGenerated: true,
      });
    }

    // Calcular promedio de estrellas (asumiendo que cada testimonio es un string con formato JSON o incluye la estrella)
    const ratings: number[] = [];
    const parsedTestimonials: {
      content: string;
      rating: number;
      author?: string;
    }[] = [];
    for (const t of testimonials) {
      try {
        // Si el testimonio es JSON, parsear
        const objUnknown: unknown = JSON.parse(t);
        if (
          objUnknown &&
          typeof objUnknown === 'object' &&
          'content' in objUnknown &&
          typeof (objUnknown as Record<string, unknown>).content === 'string' &&
          'rating' in objUnknown &&
          typeof (objUnknown as Record<string, unknown>).rating === 'number'
        ) {
          const obj = objUnknown as {
            content: string;
            rating: number;
            author?: string;
          };
          ratings.push(obj.rating);
          parsedTestimonials.push({
            content: obj.content,
            rating: obj.rating,
            author: typeof obj.author === 'string' ? obj.author : undefined,
          });
        }
      } catch {
        // Si no es JSON, intentar extraer rating con regex (ejemplo: "5 estrellas")
        const match = t.match(/([1-5])\s*estrellas?/i);
        const rating = match ? parseInt(match[1], 10) : 5;
        ratings.push(rating);
        parsedTestimonials.push({ content: t, rating });
      }
    }
    const avg =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 5;
    const avgRounded = Math.round(avg * 10) / 10;

    // Prompt personalizado para generar un "testimonio" realista
    const prompt = `Actúa como un usuario real y escribe un testimonio único y personal, en español, usando un tono cálido y humano. El testimonio debe reflejar el promedio de estrellas (${avgRounded}) de los siguientes testimonios y resumir los puntos clave y el sentimiento general. Devuelve solo el texto del testimonio, sin encabezados ni listas.\n\nTestimonios:\n${parsedTestimonials.map((t, i) => `${i + 1}. ${t.content}`).join('\n')}`;

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });
      const dataUnknown: unknown = await response.json();
      let aiContent = '';
      if (
        dataUnknown &&
        typeof dataUnknown === 'object' &&
        'choices' in dataUnknown &&
        Array.isArray((dataUnknown as Record<string, unknown>).choices)
      ) {
        const choicesArr = (dataUnknown as Record<string, unknown>).choices;
        if (
          Array.isArray(choicesArr) &&
          choicesArr[0] &&
          typeof choicesArr[0] === 'object' &&
          'message' in choicesArr[0]
        ) {
          const msgObj = (choicesArr[0] as Record<string, unknown>).message;
          if (
            msgObj &&
            typeof msgObj === 'object' &&
            'content' in msgObj &&
            typeof (msgObj as Record<string, unknown>).content === 'string'
          ) {
            aiContent = (msgObj as { content: string }).content;
          }
        }
      }
      if (!response.ok) {
        let errorMsg = 'Error al resumir testimonios con OpenRouter';
        if (
          dataUnknown &&
          typeof dataUnknown === 'object' &&
          'error' in dataUnknown &&
          (dataUnknown as Record<string, unknown>).error &&
          typeof ((dataUnknown as { error: { message?: unknown } }).error).message === 'string'
        ) {
          errorMsg = (dataUnknown as { error: { message: string } }).error.message;
        }
        throw new Error(errorMsg);
      }
      // Formato idéntico a un testimonio real
      return JSON.stringify({
        content: aiContent,
        rating: avgRounded,
        author: 'Generado por AI',
        aiGenerated: true,
      });
    } catch (error) {
      let msg = 'Error al resumir testimonios con OpenRouter';
      if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof (error as { message?: unknown }).message === 'string'
      ) {
        msg = `Error al resumir testimonios con OpenRouter: ${(error as { message: string }).message}`;
      }
      throw new Error(msg);
    }
  }
}
