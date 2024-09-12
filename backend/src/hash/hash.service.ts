import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  hash(str: string): Promise<string> {
    return bcrypt.hash(str, 10);
  }

  compare(str: string, hash: string): Promise<boolean> {
    return bcrypt.compare(str, hash);
  }
}
