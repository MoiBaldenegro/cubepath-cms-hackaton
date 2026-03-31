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
    return {
      summary: await this.summarizeUseCase.execute(organizationId),
    };
  }
}
