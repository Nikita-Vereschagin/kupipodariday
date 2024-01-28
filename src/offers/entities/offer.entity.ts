import { IsNumber } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column({
    type: 'boolean',
    default: false,
  })
  hidden: boolean;

  @IsNumber()
  @Column({
    type: 'real',
    default: '0.01',
  })
  amount: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  @JoinColumn()
  item: Wish;
}
