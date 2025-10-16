import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Crypto } from '../helpers/hashed.pass';
import { Token } from '../helpers/token';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AdminsService } from '../admins/admins.service';
import { BuyerService } from '../buyer/buyer.service';
import { Request, Response } from 'express';
import { handleError, succesMessage } from '../helpers/response';
import { error } from 'console';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminsService,
    private readonly buyerService: BuyerService,
    private readonly tokenService: Token,
    private readonly crypto: Crypto,
  ) {}

  // Register function
  async login(createAuthDto: CreateAuthDto, res: Response) {
    try {
      const { password, email } = createAuthDto;
      const admin = await this.adminService.findByEmail(email);
      const buyer = await this.buyerService.findByEmail(email);
      if (admin) {
        const pass = await this.crypto.decrypt(password, admin.password);
        if (!pass) {
          throw new NotFoundException('Invalid password');
        }
        const role = 'admin';
        const payload = {
          adminId: admin.id,
          name: admin.full_name,
          role,
        };
        const accessToken = await this.tokenService.generateAccesToken(payload);
        const refreshToken =
          await this.tokenService.generateRefreshToken(payload);
        res.cookie('AdminRefreshToken', refreshToken, { httpOnly: true });
        return succesMessage({ admin,token: accessToken, role }, 200);
      }
      if (buyer) {
        const pass = await this.crypto.decrypt(password, buyer.password);
        if (!pass) {
          throw new NotFoundException('Invalid password');
        }
        const role = 'buyer';
        const payload = {
          buyerId: buyer.id,
          name: buyer.full_name,
          status: buyer.buyerStatus,
          role,
        };
        const accessToken = await this.tokenService.generateAccesToken(payload);
        const refreshToken =
          await this.tokenService.generateRefreshToken(payload);
        res.cookie('BuyerRefreshToken', refreshToken, {
          httpOnly: true,
          secure: true,
        });
        return succesMessage({buyer, token: accessToken, role }, 200);
      }
     throw new ConflictException({ message: 'ruxsat etilmagan foydalanuvchi' });
    } catch (error) {
      handleError(error);
    }
  }
  async refresh(res: Response, req: Request) {
    try {
      const role = req.query.role;

      if (role === 'admin') {
        const oldToken = req.cookies['AdminRefreshToken'];
        if (!oldToken) {
          throw new NotFoundException('Admin refresh token topilmadi');
        }

        const payload = await this.tokenService.verifyToken(
          oldToken,
          process.env.JWT_REFRESH_KEY as string,
        );

        // ❌ JWT metadata’ni olib tashlash
        const { exp, iat, ...cleanPayload } = payload;

        // ✅ Yangi access token yaratish
        const newAccessToken =
          await this.tokenService.generateAccesToken(cleanPayload);

        return succesMessage({ token: newAccessToken }, 200);
      }

      if (role === 'buyer') {
        const oldToken = req.cookies['BuyerRefreshToken'];
        if (!oldToken) {
          throw new NotFoundException('Buyer refresh token topilmadi');
        }

        const payload = await this.tokenService.verifyToken(
          oldToken,
          process.env.JWT_REFRESH_KEY as string,
        );

        const { exp, iat, ...cleanPayload } = payload;

        const newAccessToken =
          await this.tokenService.generateAccesToken(cleanPayload);

        return succesMessage({ token: newAccessToken }, 200);
      }

      return succesMessage({ message: 'Token turi aniqlanmadi' }, 400);
    } catch (error) {
      handleError(error);
    }
  }
  async logout(res: Response, role: string) {
    try {
      if (role === 'admin') {
        res.clearCookie('AdminRefreshToken');
        return succesMessage({ message: 'Admin logout muvaffaqiyatli' }, 200);
      }

      if (role === 'buyer') {
        res.clearCookie('BuyerRefreshToken');
        return succesMessage({ message: 'Buyer logout muvaffaqiyatli' }, 200);
      }

      return succesMessage({ message: 'Token turi aniqlanmadi' }, 400);
    } catch (error) {
      handleError(error);
    }
  }
}
