import { IsNotEmpty, IsString } from 'class-validator';

export class TestimonialIdDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
