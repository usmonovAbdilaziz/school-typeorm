import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class Token {
  constructor(private jwtService: JwtService) {}

  async generateAccesToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_KEY as string,
      expiresIn: process.env.JWT_ACCESS_TIME as string,
    });
  }

  async generateRefreshToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_KEY as string,
      expiresIn: process.env.JWT_REFRESH_TIME as string,
    });
  }

  async verifyToken(token: any, secretKey: string) {
    return this.jwtService.verify(token, {
      secret: secretKey,
    });
  }
}
