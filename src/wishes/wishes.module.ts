import { Module } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wish, Offer])],
  controllers: [WishesController],
  providers: [WishesService],
})
export class WishesModule {}
