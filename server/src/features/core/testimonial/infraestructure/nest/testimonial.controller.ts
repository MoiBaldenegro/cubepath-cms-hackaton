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
import type { CreateTestimonialRequest } from '../../application/createTestimonial/CreateTestimonialRequest';
import type { UpdateTestimonialRequest } from '../../application/updateTestimonial/UpdateTestimonialRequest';

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
  async create(@Body() request: CreateTestimonialRequest) {
    return this.createTestimonial.run(request);
  }

  @Get()
  async findAll(@Query('search') search?: string) {
    return this.findAllTestimonials.run({ search });
  }

  @Get('approved')
  async findApproved(@Query('limit') limit?: number) {
    return this.findApprovedTestimonials.run({
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.findTestimonialById.run({ id });
  }

  @Patch(':id/approve')
  async approve(@Param('id') id: string) {
    return this.approveTestimonial.run({ id });
  }

  @Put(':id')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(
    @Param('id') id: string,
    @Body() request: Omit<UpdateTestimonialRequest, 'id'>,
  ) {
    return this.updateTestimonial.run({ ...request, id });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.removeTestimonial.run({ id });
  }
}
