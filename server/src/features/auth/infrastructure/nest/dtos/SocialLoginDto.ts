import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class SocialLoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  id: string; // Supabase ID

  @IsNotEmpty()
  @IsString()
  provider: string; // 'google', 'github'
}
