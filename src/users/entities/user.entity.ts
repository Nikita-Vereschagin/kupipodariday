import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail, IsNotEmpty, IsUrl, Length } from 'class-validator';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Length(2, 30)
  @Column({
    unique: true,
    default: 'Vasya228',
  })
  username: string;

  @Length(2, 200)
  @Column({
    type: 'text',
    default: 'Пока ничего не рассказал о себе.',
  })
  about: string;

  @IsNotEmpty()
  @IsUrl()
  @Column({
    default: 'https://i.pravatar.cc/300',
  })
  avatar: string;

  @IsEmail()
  @IsNotEmpty()
  @Column({
    unique: true,
    default: 'vasya228@ya.ru',
  })
  email: string;

  @IsNotEmpty()
  @Column()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.id)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlist: Wishlist;
}
