import { IsInt, IsNotEmpty, IsNumber, IsUrl, Length } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Length(1, 250)
  @Column({
    type: 'string',
    default: 'Супер пупер крутая вещь, купишь - не пожалеешь, отвечаю :O ',
  })
  name: string;

  @IsNotEmpty()
  @IsUrl()
  @Column({
    type: 'string',
    default: 'https://superpuper/228',
  })
  link: string;

  @IsNotEmpty()
  @IsUrl()
  @Column({
    type: 'string',
    default: 'https://superpuper/228',
  })
  image: string;

  @IsNumber()
  @Column({
    type: 'real',
    default: '0.99',
  })
  price: number;

  @IsNumber()
  @Column({
    type: 'real',
    default: '0.01',
  })
  raised: number;

  @Length(1, 1024)
  @Column({
    type: 'text',
    default: 'Очень крутой подарок.',
  })
  description: string;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item, {
    cascade: true,
  })
  offers: Offer[];

  @IsInt()
  @Column({
    type: 'integer',
    default: '0',
  })
  copied: number;
}
