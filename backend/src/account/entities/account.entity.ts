import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Order } from '../../order/entities/order.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { Reply } from '../../reply/entities/reply.entity';
import { Basket } from '../../basket/entities/basket.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ['male', 'female', 'not specified'],
    default: 'not specified',
  })
  sex: 'male' | 'female' | 'not specified';

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.accounts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Order, (order) => order.account)
  orders: Order[];

  @OneToMany(() => Comment, (comment) => comment.account)
  comments: Comment[];

  @OneToMany(() => Reply, (reply) => reply.account)
  replies: Reply[];

  @OneToMany(() => Basket, (basket) => basket.account)
  baskets: Basket[];
}
