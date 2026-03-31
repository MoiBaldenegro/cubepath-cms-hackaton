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

// Importaciones con 'import type' para evitar TS1272
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
// Si tienes TestimonialImageUrl, impórtalo aquí:
import { TestimonialImageUrl } from '../../../domain/value-objects/TestimonialImageUrl';

@Controller('widget')
export class WidgetController {
  constructor(
    @Inject('TestimonialRepository')
    private readonly testimonialRepository: TestimonialRepository, // ← ahora es tipo
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
      image ? new TestimonialImageUrl(`/uploads/${image.filename}`) : undefined, // ← CORREGIDO
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
          content:
            'Testimo has transformed how we gather feedback. Absolutely essential tool.',
          author: 'Alice Johnson',
          rating: 5,
        },
        {
          id: '2',
          content:
            "The API is clean and the documentation is top notch. A developer's dream.",
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
  // EMBED.JS
  // ========================
  @Public()
  @Get('embed.js')
  async embed(
    @Query('organizationId') organizationId: string,
    @Query('theme') theme: string = 'light',
    @Query('layout') layout: string = 'grid',
    @Res() res: Response,
  ) {
    const isDark = theme === 'dark';
    const apiUrl = process.env.API_URL || 'http://localhost:3000';

    let testimonials: any[] = [];
    if (organizationId === 'demo-org-id') {
      testimonials = [
        {
          id: '1',
          content:
            'Testimo has transformed how we gather feedback. Absolutely essential tool.',
          author: 'Alice Johnson',
          rating: 5,
        },
        {
          id: '2',
          content:
            "The API is clean and the documentation is top notch. A developer's dream.",
          author: 'Charlie Brown',
          rating: 5,
        },
      ];
    } else {
      const data = await this.testimonialRepository.findApprovedByOrganization(
        new OrganizationId(organizationId),
      );
      testimonials = data.map((t) => ({
        id: t.id.value,
        content: t.content.value,
        author: t.author.value,
        rating: t.rating.value,
      }));
    }

    const summary =
      testimonials.length > 0
        ? `Las personas comentan que: "${testimonials[0].content}"${
            testimonials.length > 1
              ? ` y otros ${testimonials.length - 1} testimonios más.`
              : ''
          }`
        : 'Aún no hay testimonios. ¡Sé el primero en compartir tu experiencia!';

    const jsCode = `
      (function() {
        const orgId = "${organizationId}";
        const isDark = ${isDark};
        const layout = "${layout}";

        if (document.getElementById('testimo-widget-' + orgId)) return;

        const container = document.createElement('div');
        container.id = 'testimo-widget-' + orgId;
        container.style.cssText = \`
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          padding: 32px 28px;
          background: \${isDark ? '#0f172a' : '#ffffff'};
          color: \${isDark ? '#e2e8f0' : '#1e2937'};
          border-radius: 20px;
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.15);
          max-width: 100%;
          margin: 20px auto;
        \`;

        const header = document.createElement('h2');
        header.textContent = 'What People Say';
        header.style.cssText = 'text-align: center; margin: 0 0 32px 0; font-size: 28px; font-weight: 700;';
        container.appendChild(header);

        const summaryDiv = document.createElement('div');
        summaryDiv.style.cssText = \`
          padding: 20px 24px;
          background: \${isDark ? '#1e2937' : '#f8fafc'};
          border-radius: 16px;
          margin-bottom: 32px;
          font-style: italic;
          color: \${isDark ? '#94a3b8' : '#475569'};
          text-align: center;
          font-size: 17px;
        \`;
        summaryDiv.textContent = ${JSON.stringify(summary)};
        container.appendChild(summaryDiv);

        const list = document.createElement('div');
        list.style.display = '${layout === 'grid' ? 'grid' : 'flex'}';
        list.style.gap = '24px';
        if ('${layout}' === 'grid') {
          list.style.gridTemplateColumns = 'repeat(auto-fill, minmax(320px, 1fr))';
        } else {
          list.style.flexDirection = 'column';
        }

        const data = ${JSON.stringify(testimonials)};

        data.forEach(t => {
          const card = document.createElement('div');
          card.style.cssText = \`
            background: \${isDark ? '#1e2937' : '#ffffff'};
            border: 1px solid \${isDark ? '#334155' : '#e2e8f0'};
            border-radius: 16px;
            padding: 24px;
            transition: all 0.3s ease;
          \`;
          card.innerHTML = \`
            <p style="font-size:18px;line-height:1.7;margin-bottom:20px;color:\${isDark ? '#cbd5e1' : '#334155'};">"\${t.content}"</p>
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <strong>\${t.author}</strong>
              <span style="color:#fbbf24;font-size:20px;">\${'★'.repeat(t.rating || 0)}</span>
            </div>
          \`;
          list.appendChild(card);
        });

        container.appendChild(list);

        const widgetTag = document.querySelector('testimo-widget');
        if (widgetTag) {
          widgetTag.innerHTML = '';
          widgetTag.appendChild(container);
        } else {
          const script = document.currentScript;
          if (script && script.parentNode) {
            script.parentNode.insertBefore(container, script);
          } else {
            document.body.appendChild(container);
          }
        }
      })();
    `;

    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'no-cache');
    res.send(jsCode);
  }
}
