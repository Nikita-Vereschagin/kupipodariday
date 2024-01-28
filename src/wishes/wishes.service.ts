import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class WishesService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(user: User, createWishDto: CreateWishDto) {
    const wish = this.wishRepository.save({
      ...createWishDto,
      owner: user,
    });
    delete user.password;
    return wish;
  }

  findLastWishes() {
    return this.wishRepository.find({
      relations: {
        owner: true,
        offers: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: 25,
    });
  }

  findTopWishes() {
    return this.wishRepository.find({
      relations: {
        owner: true,
        offers: true,
      },
      order: {
        createdAt: 'ASC',
      },
      take: 25,
    });
  }

  findOne(id: number) {
    return this.wishRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: true,
      },
    });
  }

  async updateOne(id: number, userId: number, updateWishDto: UpdateWishDto) {
    const user = await this.findOne(id);

    if (!user) {
      throw new Error('Пользователь не найден');
    }

    if (user.owner.id !== userId) {
      throw new Error('ID пользователя не совпадают');
    }

    if (user.offers.length > 0) {
      throw new BadRequestException('Подарок уже предложен');
    }

    return this.wishRepository.save({
      id,
      ...updateWishDto,
    });
  }

  async removeOne(id: number, userId: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new Error('Пользователь не найден');
    }

    if (user.owner.id !== userId) {
      throw new Error('ID пользователя не совпадают');
    }

    await this.wishRepository.delete({ id });

    return {};
  }

  async updateCopy(id: number, userId: number) {
    const wish = await this.wishRepository.findOneBy({ id: id });
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!wish) {
      throw new Error('Такой подарок уже существует');
    }

    if (!user) {
      throw new Error('Пользователь не найден');
    }

    const wishCopy: CreateWishDto = wish;

    wish.copied += 1;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.insert(Wish, {
        ...wishCopy,
        owner: user,
      });
      delete user.password;
      await queryRunner.manager.save(wish);
      await queryRunner.commitTransaction();
      return {};
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  findUsersWishes(id: number) {
    return this.wishRepository.find({
      where: {
        owner: {
          id,
        },
      },
    });
  }
}
