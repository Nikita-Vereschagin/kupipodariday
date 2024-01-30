import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashService } from 'src/helpers/hash/hash.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private hashService: HashService
  ) {}

  //  CREATE  \\

  async signup(dto: CreateUserDto) {
    const username = await this.userRepository.findOneBy({ username: dto.username })
    const email = await this.userRepository.findOneBy({ email: dto.email })
    if (username || email) {
      throw new ConflictException('Пользователь с таким именем или почтой уже существует')
    }
    const hash = this.hashService.getHash(dto.password)
    await this.userRepository.save({
      ...dto,
      password: hash,
    })
    return
  }

  //  FIND  \\

  findById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  findByUsername(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username });
  }

  findByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  async findMany(query: string) {
    const users = await this.userRepository.find({
      where: [{ username: Like(`%${query}%`) }, { email: Like(`%${query}%`) }],
    });

    if (!users.length) {
      throw new Error();
    }

    return users;
  }

  //  UPDATE  \\

  async updateOne(user: User, dto: UpdateUserDto) {
    let updatedUser = {}

    if (dto.hasOwnProperty('password')) {
      const hash = this.hashService.getHash(dto.password)
      updatedUser = await this.userRepository.save({
        ...user,
        ...dto,
        password: hash,
      })
    } else {
      updatedUser = await this.userRepository.save({
        ...user,
        ...dto,
      })
    }

    return updatedUser
  }
}
