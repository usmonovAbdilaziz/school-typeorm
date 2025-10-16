import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class Token {
  private readonly logger = new Logger(Token.name);

  constructor(private jwtService: JwtService) {}

  async generateAccesToken(payload: any) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_KEY as string,
      expiresIn: process.env.JWT_ACCESS_TIME as string,
    });
    return token;
  }

  async generateRefreshToken(payload: any) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_KEY as string,
      expiresIn: process.env.JWT_REFRESH_TIME as string,
    });
    return token;
  }

  async verifyToken(token: any, secretKey: string) {
    try {
      const result = this.jwtService.verify(token, {
        secret: secretKey,
      });
      return result;
    } catch (err) {
      throw new ConflictException(`Tolken not verify ${err}`);
    }
  }
}
