import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { handleError, succesMessage } from '../helpers/response';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import { Crypto } from '../helpers/hashed.pass';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin) private readonly adminRepo: Repository<Admin>,
    private readonly crypto: Crypto,
  ) {}
  async create(createAdminDto: CreateAdminDto) {
    try {
      const { email, password } = createAdminDto;
      const admin = await this.adminRepo.findOne({ where: { email } });
      if (admin) {
        throw new ConflictException('Admin already exists');
      }
      const hashPass = await this.crypto.encypt(password);

      const newAdmin = this.adminRepo.create({
        ...createAdminDto,
        password: hashPass,
      });
      await this.adminRepo.save(newAdmin);
      return succesMessage(newAdmin, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const admins = await this.adminRepo.find({
        relations: ['lots', ],
      });
      return succesMessage(admins);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: string) {
    try {
      const admin = await this.adminRepo.findOne({
        where: { id },
        relations: ['lots',],
      });
      if (!admin) {
        throw new NotFoundException('Admin not found');
      }
      return succesMessage(admin);
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: string, updateAdminDto: UpdateAdminDto) {
    try {
      const { password, email, newPassword, full_name } = updateAdminDto;

      // 1. Email tekshiruv
      if (email) {
        const thisEmail = await this.adminRepo.findOne({ where: { email } });
        if (thisEmail && thisEmail.id !== id) {
          throw new ConflictException('Email already exists');
        }
      }

      // 2. Adminni topish
      const admin = await this.adminRepo.findOne({ where: { id } });
      if (!admin) {
        throw new NotFoundException('Admin not found');
      }

      // 3. Parol yangilash
      let newHashPass: string | undefined;
      if (password && newPassword) {
        const isOldPassValid = await this.crypto.decrypt(
          password,
          admin.password,
        );
        if (!isOldPassValid) {
          throw new NotFoundException('Old password incorrect');
        }
        newHashPass = await this.crypto.encypt(newPassword);
      }

      // 4. Update qilish
      await this.adminRepo.update(id, {
        full_name: full_name ?? admin.full_name,
        email: email ?? admin.email,
        password: newHashPass ?? admin.password,
      });

      // 5. Yangilangan adminni qaytarish
      const newAdmin = await this.findOne(id);
      return succesMessage(newAdmin!);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      await this.adminRepo.delete({ id });
      return succesMessage({ message: 'Deleted admin from ID' });
    } catch (error) {
      handleError(error);
    }
  }
  async findByEmail(email: string) {
    return this.adminRepo.findOne({ where: { email } });
  }
}
