import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Token } from '../helpers/token';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private readonly tokenService: Token) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers['authorization'];

      if (!authHeader) {
        throw new UnauthorizedException("Token yo'q");
      }

      const token = authHeader.replace('Bearer ', '');
      const user = await this.tokenService.verifyToken(
        token,
        process.env.JWT_ACCESS_KEY as string,
      );
      req.user = user;

      return true;
    } catch (error) {
      throw new UnauthorizedException("Token noto'g'ri");
    }
  }
}
