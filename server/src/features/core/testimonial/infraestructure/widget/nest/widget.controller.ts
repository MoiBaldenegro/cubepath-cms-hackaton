import {
  Controller,
  Get,
  Post,
  Query,
  Res,
  Inject,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import type { Response } from 'express';
import type { Request } from 'express';

import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { randomUUID } from 'crypto';

import type { TestimonialRepository } from '../../../domain/ports/TestimonialRepository';

import { OrganizationId } from '../../../domain/value-objects/OrganizationId';
import { Public } from '../../../../../auth/infrastructure/nest/decorators/public.decorator';

import { Testimonial } from '../../../domain/Testimonial';
import { TestimonialId } from '../../../domain/value-objects/TestimonialId';
import { TestimonialContent } from '../../../domain/value-objects/TestimonialContent';
import { TestimonialAuthor } from '../../../domain/value-objects/TestimonialAuthor';
import { TestimonialRating } from '../../../domain/value-objects/TestimonialRating';
import {
  TestimonialStatus,
  TestimonialStatusEnum,
} from '../../../domain/value-objects/TestimonialStatus';
import {
  TestimonialCategory,
  TestimonialCategoryEnum,
} from '../../../domain/value-objects/TestimonialCategory';
import {
  TestimonialTag,
  TestimonialTagEnum,
} from '../../../domain/value-objects/TestimonialTag';
import { TestimonialIdempotencyKey } from '../../../domain/value-objects/TestimonialIdempotencyKey';
import { TestimonialIsEdited } from '../../../domain/value-objects/TestimonialIsEdited';
import { TestimonialCreatedAt } from '../../../domain/value-objects/TestimonialCreatedAt';
import { TestimonialImageUrl } from '../../../domain/value-objects/TestimonialImageUrl';

@Controller('widget')
export class WidgetController {
  constructor(
    @Inject('TestimonialRepository')
    private readonly testimonialRepository: TestimonialRepository,
  ) {}

  // ========================
  // SUBMIT TESTIMONIAL
  // ========================
  @Public()
  @Post('submit')
  @UseInterceptors(FileInterceptor('image'))
  async submit(
    @UploadedFile() image: Express.Multer.File | undefined,
    @Req() req: Request,
  ) {
    const { organizationId, author, content, rating, videoUrl } =
      req.body || {};

    if (!organizationId || !author || !content || !rating) {
      return { success: false, message: 'Missing required fields' };
    }

    const testimonial = new Testimonial(
      new TestimonialId(randomUUID()),
      new TestimonialIdempotencyKey(randomUUID()),
      new TestimonialContent(content),
      new TestimonialAuthor(author),
      new TestimonialStatus(TestimonialStatusEnum.PENDING),
      [new TestimonialTag(TestimonialTagEnum.GENERAL)],
      new TestimonialRating(Number(rating)),
      new TestimonialCategory(TestimonialCategoryEnum.OTHER),
      new TestimonialIsEdited(false),
      new OrganizationId(organizationId),
      image ? new TestimonialImageUrl(`/uploads/${image.filename}`) : undefined,
      videoUrl || undefined,
      new TestimonialCreatedAt(new Date()),
      undefined,
    );

    await this.testimonialRepository.create(testimonial);

    return { success: true, message: 'Testimonial submitted successfully' };
  }

  // ========================
  // GET DATA
  // ========================
  @Public()
  @Get('data')
  async getData(@Query('organizationId') organizationId: string) {
    if (!organizationId) return [];

    if (organizationId === 'demo-org-id') {
      return [
        {
          id: '1',
          content: 'Testimo has transformed how we gather feedback...',
          author: 'Alice Johnson',
          rating: 5,
        },
        {
          id: '2',
          content: 'The API is clean and the documentation is top notch...',
          author: 'Charlie Brown',
          rating: 5,
        },
      ];
    }

    const testimonials =
      await this.testimonialRepository.findApprovedByOrganization(
        new OrganizationId(organizationId),
      );

    return testimonials.map((t) => ({
      id: t.id.value,
      content: t.content.value,
      author: t.author.value,
      rating: t.rating.value,
    }));
  }

  // ========================
  // EMBED.JS → Sirve el mismo código que tienes en src/main.ts
  // ========================
  @Public()
  @Get('embed.js')
  getEmbed(@Res() res: Response) {
    const filePath = join(
      process.cwd(),
      'src/features/core/testimonial/infraestructure/widget/nest/main.ts',
    );
    // O mejor: sirve el archivo compilado si usas Vite/Rollup

    // Opción recomendada: Servir el archivo JS compilado
    // Asumiendo que tienes un build del web component en: dist/widget/testimo-widget.js

    const widgetPath = join(process.cwd(), 'dist/widget/testimo-widget.js'); // Ajusta esta ruta según tu build

    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'no-cache');

    // Si el archivo existe, lo servimos directamente
    res.sendFile(widgetPath, (err) => {
      if (err) {
        // Fallback: si no existe el archivo compilado, devolvemos un mensaje claro
        res
          .status(404)
          .send(
            `// Error: testimo-widget.js no encontrado.\n// Por favor compila el Web Component primero.`,
          );
      }
    });
  }

  // ========================
  // SDK (opcional)
  // ========================
  @Public()
  @Get('sdk.js')
  getSdk(@Res() res: Response) {
    const filePath = join(process.cwd(), '../sdk/dist/sdk.js');
    res.sendFile(filePath);
  }
}
