import { Injectable } from '@nestjs/common';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';

@Injectable()
export class HashService {
    getHash(password: string) {
        return hashSync(password, genSaltSync(10))
    }

    compare(password: string, hash: string) {
        return compareSync(password, hash)
    }
}