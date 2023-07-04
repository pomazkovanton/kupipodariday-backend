import { Injectable } from '@nestjs/common';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';

@Injectable()
export class HashService {
  getHash(password: string) {
    return hashSync(password, genSaltSync(10));
  }

  compare(password, hash) {
    return compareSync(password, hash);
  }
}
