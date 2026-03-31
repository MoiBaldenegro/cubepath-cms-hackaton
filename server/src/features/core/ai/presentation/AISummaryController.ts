import { Controller, Post, Body } from '@nestjs/common';
import { SummarizeTestimonialsUseCase } from '../application/SummarizeTestimonialsUseCase';
// --force controller
@Controller('ai/summary')
export class AISummaryController {
  constructor(
    private readonly summarizeUseCase: SummarizeTestimonialsUseCase,
  ) {}

  @Post()
  async summarize(@Body('organizationId') organizationId: string) {
    const result = await this.summarizeUseCase.execute(organizationId);
    // Si el resultado es un string JSON, parsear, si no, devolver como está
    try {
      return typeof result === 'string' ? JSON.parse(result) : result;
    } catch {
      return { content: result, aiGenerated: true, author: 'Generado por AI' };
    }
  }
}
