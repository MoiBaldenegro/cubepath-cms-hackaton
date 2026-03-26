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
  UseGuards,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TestimonialServiceContainer } from '../../../../shared/infrastructure/TestimonialServiceContainer';
import { CreateTestimonialDto } from './dtos/CreateTestimonialDto';
import { UpdateTestimonialDto } from './dtos/UpdateTestimonialDto';
import { FindAllTestimonialsDto } from './dtos/FindAllTestimonialsDto';
import { FindApprovedTestimonialsDto } from './dtos/FindApprovedTestimonialsDto';
import { TestimonialIdDto } from './dtos/TestimonialIdDto';
import { JwtAuthGuard } from '../../../../auth/infrastructure/nest/guards/jwt-auth.guard';
import { Public } from '../../../../auth/infrastructure/nest/decorators/public.decorator';

@Controller('testimonial')
@UseGuards(JwtAuthGuard)
export class TestimonialController {
  constructor(
    private readonly testimonialServices: TestimonialServiceContainer,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() request: CreateTestimonialDto,
    @Request() req,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const { organizationId } = req.user;
    let imageUrl = request.imageUrl;
    if (image) {
      // Use the uploadImage use case to upload the file and get the URL
      imageUrl = await this.testimonialServices.uploadImage.execute(image);
    }
    await this.testimonialServices.createTestimonial.run({
      ...request,
      organizationId,
      imageUrl,
    });
    return { success: true };
  }

  @Get()
  async findAll(@Query() query: FindAllTestimonialsDto, @Request() req) {
    const { organizationId } = req.user;
    const testimonials = await this.testimonialServices.findAllTestimonials.run(
      { ...query, organizationId },
    );
    return testimonials.map((t) => t.toPrimitives());
  }

  @Public()
  @Get('approved')
  async findApproved(@Query() query: FindApprovedTestimonialsDto) {
    const testimonials =
      await this.testimonialServices.findApprovedTestimonials.run(query);
    return testimonials.map((t) => t.toPrimitives());
  }

  @Get(':id')
  async findOne(@Param() params: TestimonialIdDto) {
    const testimonial =
      await this.testimonialServices.findTestimonialById.run(params);
    return testimonial.toPrimitives();
  }

  @Patch(':id/approve')
  async approve(@Param() params: TestimonialIdDto) {
    return this.testimonialServices.approveTestimonial.run(params);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateTestimonialDto) {
    return this.testimonialServices.updateTestimonial.run({ ...body, id });
  }

  @Delete(':id')
  async remove(@Param() params: TestimonialIdDto) {
    return this.testimonialServices.removeTestimonial.run(params);
  }
}
