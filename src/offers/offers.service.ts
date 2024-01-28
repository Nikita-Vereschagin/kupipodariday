import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class OffersService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(id: number, dto: CreateOfferDto) {
    const { itemId, hidden, amount } = dto;
    const user = await this.userRepository.findOneBy({ id: id })
    const wish = await this.wishRepository.findOne({
      where: { id: itemId },
      relations: ['owner'],
    });

    if (!wish) {
      throw new NotFoundException('Такого подарка нет')
    }

    if (wish.owner.id === user.id) {
      throw new BadRequestException('Недостаточно прав на удаление')
    }

    if (wish.raised + amount > wish.price) {
      throw new BadRequestException('Вносимая сумма слишком большая')
    } else {
      wish.raised = wish.raised + amount
    }

    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      await queryRunner.manager.insert(Offer, {
        amount,
        hidden,
        user,
      });
      delete user.password;
      await queryRunner.manager.save(wish)
      await queryRunner.commitTransaction()
      return {};
    } catch (e) {
      await queryRunner.rollbackTransaction()
      return false
    } finally {
      await queryRunner.release()
    }
  }

  findAll() {
    return this.offerRepository.find({
      relations: ['items'],
    });
  }

  findOne(id: number) {
    return this.offerRepository.findOne({
      where: { id },
      relations: { user: true },
    });
  }
}
