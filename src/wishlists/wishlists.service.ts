import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { In, Repository } from 'typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(user: User, dto: CreateWishlistDto) {
    const items = await this.wishRepository.find({
      where: { id: In(dto.itemsId) },
    });
    const wishlist = new Wishlist();

    wishlist.owner = user;
    wishlist.name = dto.name;
    wishlist.image = dto.image;
    wishlist.items = items;

    await this.wishlistRepository.save(wishlist);
    return wishlist;
  }

  findAll() {
    return this.wishlistRepository.find({
      relations: ['owner', 'items'],
    });
  }

  async findOne(id: number) {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });

    if (!wishlist) {
      throw new NotFoundException('Такого списка нет');
    }

    return wishlist;
  }

  async updateOne(id: number, userId: number, dto: UpdateWishlistDto) {
    const wishlist = await this.findOne(id);

    if (!wishlist) {
      throw new NotFoundException('Такого списка нет');
    }

    if (wishlist.owner.id !== userId) {
      throw new BadRequestException('Недостаточно прав на удаление');
    }

    const items = await this.wishRepository.find({
      where: { id: In(dto.itemsId) },
    });

    return await this.wishlistRepository.save({
      ...wishlist,
      name: dto.name,
      image: dto.image,
      items: items.length === 0 ? wishlist.items : items,
    });
  }

  async removeOne(id: number, userId: number) {
    const wishlist = this.findOne(id);

    if (!wishlist) {
      throw new NotFoundException('Такого списка нет');
    }

    if ((await wishlist).owner.id !== userId) {
      throw new BadRequestException('Недостаточно прав на удаление');
    }

    await this.wishlistRepository.delete(id);

    return wishlist;
  }
}
