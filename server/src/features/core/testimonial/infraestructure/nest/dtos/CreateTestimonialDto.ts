import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

export class CreateTestimonialDto {
  @IsString()
  @IsNotEmpty()
  iKey: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }: TransformFnParams) => {
    // Si no hay valor, devolvemos un array vacío
    if (value === null || value === undefined) return [];

    // Si ya es un array, lo devolvemos asegurando que TS sepa que es de strings
    if (Array.isArray(value)) return value as string[];

    // Si es un solo string (caso típico de FormData con un solo elemento), lo metemos en un array
    return [String(value)];
  })
  tags: string[];

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsUrl()
  @IsOptional()
  videoUrl?: string;
}
