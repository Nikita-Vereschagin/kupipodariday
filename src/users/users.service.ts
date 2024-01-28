import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  //  CREATE  \\

  async signup(dto: CreateUserDto) {
    const username = await this.userRepository.findOneBy({ username: dto.username })
    const email = await this.userRepository.findOneBy({ email: dto.email })
    if (username || email) {
      throw new ConflictException('Пользователь с таким именем или почтой уже существует')
    }
    return await bcrypt.hash(dto.password, 10).then((hashed) =>
      this.userRepository.save({
        ...dto,
        password: hashed,
      }),
    );
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
    let updatedUser = {};

    if (dto.hasOwnProperty('password')) {
      updatedUser = await bcrypt
        .hash(dto.password, 10)
        .then((hashed) =>
          this.userRepository.save({
            ...user,
            ...dto,
            password: hashed,
          }),
        );
    } else {
      updatedUser = await this.userRepository.save({
        ...user,
        ...dto,
      });
    }

    return updatedUser;
  }
}
