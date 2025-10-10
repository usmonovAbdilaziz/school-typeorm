import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { handleError, succesMessage } from '../helpers/response';
import { InjectRepository } from '@nestjs/typeorm';
import { Buyer } from './entities/buyer.entity';
import { Repository } from 'typeorm';
import { Crypto } from '../helpers/hashed.pass';

@Injectable()
export class BuyerService {
  constructor(
    @InjectRepository(Buyer) private readonly buyerRepo: Repository<Buyer>,
    private readonly crypto: Crypto,
  ) {}
  async create(createBuyerDto: CreateBuyerDto) {
    try {
      const { password, email } = createBuyerDto;
      const existsEmail = await this.buyerRepo.findOne({ where: { email } });
      if (existsEmail) {
        throw new ConflictException('Email already exists');
      }
      const hashPass = await this.crypto.encypt(password);
      const newBuyer = this.buyerRepo.create({
        ...createBuyerDto,
        password: hashPass,
        buyerPass:password
      });
      await this.buyerRepo.save(newBuyer);
      return succesMessage(newBuyer, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const buyers = await this.buyerRepo.find({
        relations: ['interests', 'comments', 'results', 'payment', 'cards'],
      });
      return succesMessage(buyers);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: string) {
    try {
      const buyer = await this.buyerRepo.findOne({
        where: { id },
        relations: ['interests', 'comments', 'results', 'payment','cards'],
      });
      if (!buyer) {
        throw new NotFoundException('Buyer not found');
      }
      return succesMessage(buyer);
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: string, updateBuyerDto: UpdateBuyerDto) {
    try {
      const {
        password,
        newPassword,
        email,
        full_name,
        interested,
        buyerStatus,
      } = updateBuyerDto;
      await this.findOne(id);
      if (newPassword && !password) {
        throw new NotFoundException('Password notfound');
      }
      let hashPass: string | undefined;
      if (password) {
        const pass = await this.buyerRepo.findOne({ where: { id } });
        const newPass = await this.crypto.decrypt(password, pass!.password);
        if (!newPass) {
          throw new NotFoundException('Invalid password');
        }
        if (newPassword) {
          hashPass = await this.crypto.encypt(newPassword);
        }
      }

      await this.buyerRepo.update(id, {
        email,
        full_name,
        password: hashPass,
        ...(buyerStatus && { buyerStatus }),
      });
      const buyer = await this.findOne(id);
      return buyer;
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      await this.buyerRepo.delete({ id });
      return succesMessage({ message: 'Deleted buyer from ID' });
    } catch (error) {
      handleError(error);
    }
  }
  async findByEmail(email: string) {
    return this.buyerRepo.findOne({ where: { email } });
  }
}
