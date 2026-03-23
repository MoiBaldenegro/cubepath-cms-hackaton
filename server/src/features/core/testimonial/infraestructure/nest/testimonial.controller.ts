import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TestimonialCreate } from '../../application/createTestimonial/createTestimonial';
import { FindAllTestimonials } from '../../application/findAllTestimonials/FindAllTestimonials';
import { ApproveTestimonial } from '../../application/approveTestimonial/ApproveTestimonial';
import { FindTestimonialById } from '../../application/findTestimonialById/FindTestimonialById';
import { FindApprovedTestimonials } from '../../application/findApprovedTestimonials/FindApprovedTestimonials';
import { UpdateTestimonial } from '../../application/updateTestimonial/UpdateTestimonial';
import { RemoveTestimonial } from '../../application/removeTestimonial/RemoveTestimonial';
import { CreateTestimonialDto } from './dtos/CreateTestimonialDto';
import { UpdateTestimonialDto } from './dtos/UpdateTestimonialDto';
import { FindAllTestimonialsDto } from './dtos/FindAllTestimonialsDto';
import { FindApprovedTestimonialsDto } from './dtos/FindApprovedTestimonialsDto';
import { TestimonialIdDto } from './dtos/TestimonialIdDto';

@Controller('testimonial')
export class TestimonialController {
  constructor(
    private readonly createTestimonial: TestimonialCreate,
    private readonly findAllTestimonials: FindAllTestimonials,
    private readonly approveTestimonial: ApproveTestimonial,
    private readonly findTestimonialById: FindTestimonialById,
    private readonly findApprovedTestimonials: FindApprovedTestimonials,
    private readonly updateTestimonial: UpdateTestimonial,
    private readonly removeTestimonial: RemoveTestimonial,
  ) {}

  @Post()
  async create(@Body() request: CreateTestimonialDto) {
    await this.createTestimonial.run(request);
    return { success: true };
  }

  @Get()
  async findAll(@Query() query: FindAllTestimonialsDto) {
    const testimonials = await this.findAllTestimonials.run(query);
    return testimonials.map((t) => t.toPrimitives());
  }

  @Get('approved')
  async findApproved(@Query() query: FindApprovedTestimonialsDto) {
    const testimonials = await this.findApprovedTestimonials.run(query);
    return testimonials.map((t) => t.toPrimitives());
  }

  @Get(':id')
  async findOne(@Param() params: TestimonialIdDto) {
    const testimonial = await this.findTestimonialById.run(params);
    return testimonial.toPrimitives();
  }

  @Patch(':id/approve')
  async approve(@Param() params: TestimonialIdDto) {
    return this.approveTestimonial.run(params);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateTestimonialDto) {
    return this.updateTestimonial.run({ ...body, id });
  }

  @Delete(':id')
  async remove(@Param() params: TestimonialIdDto) {
    return this.removeTestimonial.run(params);
  }
}
