import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SigninDto } from './dto/signin.dto';
import { HashService } from 'src/helpers/hash/hash.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private hashService: HashService,
  ) {}

  async signin(dto: SigninDto) {
    const user = await this.usersService.findByUsername(dto.username)
    return {
      access_token: this.jwtService.sign({ id: user.id }),
    };
  }

  async checkPassword(dto: SigninDto) {
    const user = await this.usersService.findByUsername(dto.username)

    if (!user || !this.hashService.compare(dto.password, user.password)) {
        throw new UnauthorizedException('Неверный логин или пароль')
      }

    return user
  }
}
