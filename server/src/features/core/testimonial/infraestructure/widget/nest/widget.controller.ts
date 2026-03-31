import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Res,
  Inject,
} from '@nestjs/common';
import type { Response } from 'express';
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
import { randomUUID } from 'crypto';
import { join } from 'path';

/**
 * WidgetController
 *
 * Permite dos formas de integración:
 * 1. Script embed: <script src=".../widget/embed.js?..." /> (auto-montaje, sin tag especial)
 *    - El widget se monta automáticamente antes del <script>.
 *    - Renderiza: resumen IA, lista de testimonios, formulario.
 * 2. SDK npm: para integración avanzada en frameworks modernos.
 *
 * El endpoint /widget/embed.js soporta ambos modos y ahora incluye el resumen IA.
 */
@Controller('widget')
export class WidgetController {
  constructor(
    @Inject('TestimonialRepository')
    private readonly testimonialRepository: TestimonialRepository,
  ) {}

  @Public()
  @Post('submit')
  async submit(
    @Body()
    body: {
      organizationId: string;
      content: string;
      author: string;
      rating: number;
    },
  ) {
    const { organizationId, content, author, rating } = body;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const category = TestimonialCategoryEnum.OTHER;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const tag = TestimonialTagEnum.GENERAL;

    const testimonial = new Testimonial(
      new TestimonialId(randomUUID()),
      new TestimonialIdempotencyKey(randomUUID()),
      new TestimonialContent(content),
      new TestimonialAuthor(author),
      new TestimonialStatus(TestimonialStatusEnum.PENDING),
      [new TestimonialTag(tag)],
      new TestimonialRating(Number(rating)),
      new TestimonialCategory(category),
      new TestimonialIsEdited(false),
      new OrganizationId(organizationId),
      undefined, // imageUrl
      undefined, // videoUrl
      new TestimonialCreatedAt(new Date()),
      undefined, // updatedAt
    );

    await this.testimonialRepository.create(testimonial);

    return { success: true };
  }

  @Public()
  @Get('sdk.js')
  getSdk(@Res() res: Response) {
    const filePath = join(process.cwd(), '../sdk/dist/sdk.js');
    res.sendFile(filePath);
  }

  @Public()
  @Get('data')
  async getData(@Query('organizationId') organizationId: string) {
    if (organizationId === 'demo-org-id') {
      return [
        {
          id: '1',
          content:
            'Testimo has transformed how we gather feedback. Absolutely essential tool.',
          author: 'Alice Johnson',
          rating: 5,
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          content:
            "The API is clean and the documentation is top notch. A developer's dream.",
          author: 'Charlie Brown',
          rating: 5,
          createdAt: new Date().toISOString(),
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
      createdAt: t.createdAt?.value,
    }));
  }

  @Public()
  @Get('embed.js')
  async embed(
    @Query('organizationId') organizationId: string,
    @Query('theme') theme: string = 'light',
    @Query('layout') layout: string = 'grid',
    @Res() res: Response,
  ) {
    // 1. Obtener testimonios
    let data;
    if (organizationId === 'demo-org-id') {
      data = [
        {
          id: '1',
          content:
            'Testimo has transformed how we gather feedback. Absolutely essential tool.',
          author: 'Alice Johnson',
          rating: 5,
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          content:
            "The API is clean and the documentation is top notch. A developer's dream.",
          author: 'Charlie Brown',
          rating: 5,
          createdAt: new Date().toISOString(),
        },
      ];
    } else {
      const testimonials =
        await this.testimonialRepository.findApprovedByOrganization(
          new OrganizationId(organizationId),
        );
      data = testimonials.map((t) => ({
        id: t.id.value,
        content: t.content.value,
        author: t.author.value,
        rating: t.rating.value,
        createdAt: t.createdAt?.value,
      }));
    }

    // 2. Obtener resumen IA (mock/demo)
    // TODO: Reemplazar por llamada real a IA si existe endpoint
    let summary = '';
    if (data.length > 0) {
      summary = `Resumen IA: ${data.length} testimonios. Ejemplo: "${data[0].content}"`;
    } else {
      summary = 'Aún no hay testimonios para analizar.';
    }

    const apiUrl = process.env.API_URL || 'http://localhost:3000';

    // 3. Generar JS para el widget
    const jsCode = `
      (function() {
        // Create container
        const containerId = 'testimonial-widget-' + '${organizationId}';
        if (document.getElementById(containerId)) return; // Prevent duplicate injection

        const container = document.createElement('div');
        container.id = containerId;
        container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif';
        container.style.padding = '24px';
        container.style.backgroundColor = '${theme === 'dark' ? '#1a1a1a' : '#ffffff'}';
        container.style.color = '${theme === 'dark' ? '#ffffff' : '#333333'}';
        container.style.borderRadius = '12px';
        container.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        container.style.maxWidth = '100%';
        container.style.margin = '20px auto';

        // --- IA SUMMARY BOX ---
        const summaryBox = document.createElement('div');
        summaryBox.style.padding = '18px 20px';
        summaryBox.style.background = '${theme === 'dark' ? '#23272f' : '#f1f5f9'}';
        summaryBox.style.borderRadius = '10px';
        summaryBox.style.marginBottom = '28px';
        summaryBox.style.fontSize = '16px';
        summaryBox.style.fontStyle = 'italic';
        summaryBox.style.color = '${theme === 'dark' ? '#cbd5e1' : '#334155'}';
        summaryBox.innerText = ${JSON.stringify(summary)};
        container.appendChild(summaryBox);

        // Header
        const header = document.createElement('div');
        header.style.marginBottom = '24px';
        header.style.textAlign = 'center';

        const title = document.createElement('h2');
        title.innerText = 'What People Say';
        title.style.margin = '0 0 8px 0';
        title.style.fontSize = '24px';
        title.style.fontWeight = '600';
        header.appendChild(title);

        container.appendChild(header);

        // Grid/List Layout
        const list = document.createElement('div');
        list.style.display = '${layout === 'grid' ? 'grid' : 'flex'}';
        list.style.gap = '20px';

        if ('${layout}' === 'grid') {
          list.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
        } else {
          list.style.flexDirection = 'column';
        }

        const data = ${JSON.stringify(data)};

        if (data.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.innerText = 'No approved testimonials yet.';
            emptyState.style.textAlign = 'center';
            emptyState.style.color = '#888';
            emptyState.style.padding = '20px';
            container.appendChild(emptyState);
        } else {
            data.forEach(t => {
                const item = document.createElement('div');
                item.style.border = '1px solid ${theme === 'dark' ? '#333' : '#eee'}';
                item.style.padding = '20px';
                item.style.borderRadius = '12px';
                item.style.backgroundColor = '${theme === 'dark' ? '#2d2d2d' : '#f8f9fa'}';
                item.style.transition = 'transform 0.2sease';

                // Content
                const text = document.createElement('p');
                text.innerText = '"' + t.content + '"';
                text.style.fontStyle = 'italic';
                text.style.fontSize = '16px';
                text.style.lineHeight = '1.6';
                text.style.marginBottom = '16px';
                item.appendChild(text);

                // Footer
                const footer = document.createElement('div');
                footer.style.display = 'flex';
                footer.style.alignItems = 'center';
                footer.style.justifyContent = 'space-between';
                footer.style.marginTop = 'auto';

                const author = document.createElement('div');
                author.innerHTML = '<strong>' + t.author + '</strong>';
                footer.appendChild(author);

                if (t.rating) {
                    const rating = document.createElement('div');
                    rating.innerText = '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating);
                    rating.style.color = '#f59e0b';
                    rating.style.fontSize = '18px';
                    footer.appendChild(rating);
                }

                item.appendChild(footer);
                list.appendChild(item);
            });
            container.appendChild(list);
        }

        // Form Section
        const formSection = document.createElement('div');
        formSection.style.marginTop = '40px';
        formSection.style.paddingTop = '20px';
        formSection.style.borderTop = '1px solid ${theme === 'dark' ? '#333' : '#eee'}';

        const formTitle = document.createElement('h3');
        formTitle.innerText = 'Share your experience';
        formTitle.style.textAlign = 'center';
        formTitle.style.marginBottom = '20px';
        formTitle.style.fontSize = '20px';
        formSection.appendChild(formTitle);

        const form = document.createElement('form');
        form.style.display = 'flex';
        form.style.flexDirection = 'column';
        form.style.gap = '15px';
        form.style.maxWidth = '500px';
        form.style.margin = '0 auto';

        const inputStyle = 'width: 100%; padding: 12px; border-radius: 8px; border: 1px solid ${theme === 'dark' ? '#444' : '#ccc'}; background-color: ${theme === 'dark' ? '#2d2d2d' : '#fff'}; color: ${theme === 'dark' ? '#fff' : '#333'}; font-family: inherit; box-sizing: border-box;';

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.name = 'author';
        nameInput.placeholder = 'Your Name';
        nameInput.required = true;
        nameInput.style.cssText = inputStyle;
        form.appendChild(nameInput);

        const ratingSelect = document.createElement('select');
        ratingSelect.name = 'rating';
        ratingSelect.style.cssText = inputStyle;
        [
            { val: 5, label: '★★★★★ Excellent' },
            { val: 4, label: '★★★★☆ Good' },
            { val: 3, label: '★★★☆☆ Average' },
            { val: 2, label: '★★☆☆☆ Poor' },
            { val: 1, label: '★☆☆☆☆ Terrible' }
        ].forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.val;
            option.innerText = opt.label;
            ratingSelect.appendChild(option);
        });
        form.appendChild(ratingSelect);

        const contentInput = document.createElement('textarea');
        contentInput.name = 'content';
        contentInput.placeholder = 'Your Testimonial';
        contentInput.required = true;
        contentInput.style.cssText = inputStyle + ' resize: vertical; min-height: 80px;';
        form.appendChild(contentInput);

        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.innerText = 'Submit Testimonial';
        submitBtn.style.cssText = 'padding: 12px 24px; background-color: #3b82f6; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background-color 0.2s;';
        submitBtn.onmouseover = () => submitBtn.style.backgroundColor = '#2563eb';
        submitBtn.onmouseout = () => submitBtn.style.backgroundColor = '#3b82f6';
        form.appendChild(submitBtn);

        const feedback = document.createElement('div');
        feedback.style.textAlign = 'center';
        feedback.style.marginTop = '10px';
        feedback.style.fontWeight = '500';

        form.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            submitBtn.disabled = true;
            submitBtn.innerText = 'Submitting...';
            submitBtn.style.backgroundColor = '#93c5fd';
            submitBtn.style.cursor = 'not-allowed';

            try {
                const response = await fetch('${apiUrl}/widget/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...data, organizationId: '${organizationId}' }),
                });

                if (!response.ok) throw new Error('Failed');

                form.reset();
                feedback.innerText = 'Thank you! Your testimonial has been submitted for review.';
                feedback.style.color = '#10b981';
            } catch (err) {
                feedback.innerText = 'Error submitting testimonial. Please try again.';
                feedback.style.color = '#ef4444';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = 'Submit Testimonial';
                submitBtn.style.backgroundColor = '#3b82f6';
                submitBtn.style.cursor = 'pointer';
            }
        };

        formSection.appendChild(form);
        formSection.appendChild(feedback);
        container.appendChild(formSection);

        // --- INYECCIÓN: Si existe <testimo-widget>, renderiza ahí. Si no, modo clásico ---
        const customTag = document.querySelector('testimo-widget');
        if (customTag) {
          customTag.innerHTML = '';
          customTag.appendChild(container);
        } else {
          const currentScript = document.currentScript;
          if (currentScript && currentScript.parentNode) {
            currentScript.parentNode.insertBefore(container, currentScript);
          } else {
            document.body.appendChild(container); // Fallback
          }
        }
      })();
    `;

    res.set('Content-Type', 'application/javascript');
    res.send(jsCode);
  }
}
