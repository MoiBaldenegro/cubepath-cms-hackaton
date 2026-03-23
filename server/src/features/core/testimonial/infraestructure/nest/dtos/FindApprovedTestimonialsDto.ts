import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FindApprovedTestimonialsDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit?: number;
}
