import { IsOptional, IsString } from 'class-validator';

export class FindAllTestimonialsDto {
  @IsString()
  @IsOptional()
  search?: string;
}
