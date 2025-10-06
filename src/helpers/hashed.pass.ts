import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class Crypto {
  async encypt(data: string) {
    const hashPass = await bcrypt.hash(data, 10);
    return hashPass;
  }
  async decrypt(oldData: string, data: string) {
    const passwords = await bcrypt.compare(oldData, data);
    return passwords;
  }
}
