import { Controller, Post, Body, Res, Req, Query, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Request, Response } from 'express';
import { Token } from '../helpers/token';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: Token,
  ) {}

  @Post('login')
  login(
    @Body() createAuthDto: CreateAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(createAuthDto, res);
  }

  @Post('refresh')
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.refresh(res, req);
  }

  @Post('logout')
  logout(
    @Res({ passthrough: true }) res: Response,
    @Query('role') role: string,
  ) {
    return this.authService.logout(res, role);
  }
}
