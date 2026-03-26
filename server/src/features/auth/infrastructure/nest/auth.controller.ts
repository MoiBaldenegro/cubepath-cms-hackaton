import { Body, Controller, Post } from '@nestjs/common';
import { Login } from '../../application/login/Login';
import { Register } from '../../application/register/Register';
import { SocialAuthService } from '../../application/social/SocialAuthService';
import { LoginDto } from './dtos/LoginDto';
import { RegisterDto } from './dtos/RegisterDto';
import { SocialLoginDto } from './dtos/SocialLoginDto';
import { Public } from './decorators/public.decorator';

import { CreateModerator } from '../../application/createModerator/CreateModerator';
import { CreateModeratorDto } from './dtos/CreateModeratorDto';
import { UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: Login,
    private readonly registerUseCase: Register,
    private readonly socialAuthService: SocialAuthService,
    private readonly createModeratorUseCase: CreateModerator,
  ) {}

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.loginUseCase.run(body);
  }

  @Public()
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.registerUseCase.run(body);
  }

  @Public()
  @Post('social-login')
  async socialLogin(@Body() body: SocialLoginDto) {
    return this.socialAuthService.run(body);
  }

  @Post('moderators')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createModerator(@Body() body: CreateModeratorDto, @Request() req) {
    const { organizationId } = req.user;
    return this.createModeratorUseCase.run({
      ...body,
      organizationId,
    });
  }
}
