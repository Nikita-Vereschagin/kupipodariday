import { IsNotEmpty, IsUrl, Length } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Length(1, 250)
  @Column({
    default: 'Супер пупер список',
  })
  name: string;

  @IsNotEmpty()
  @IsUrl()
  @Column({
    default: 'https://superpuper/228',
  })
  image: string;

  @Length(0, 1500)
  @Column({
    type: 'text',
    default: 'Отвечаю, Джони Депп позавидует такой одежде',
  })
  description: string;

  @ManyToOne(() => User, (user) => user.wishlist)
  owner: User;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];
}
