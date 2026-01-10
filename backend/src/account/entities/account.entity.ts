import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from '../../user/entities/user.entity';
import { Order } from '../../order/entities/order.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { Reply } from '../../comment/entities/reply.entity';
import { Basket } from '../../basket/entities/basket.entity';
import { CommentLike } from '../../comment/entities/comment-likes.entity';
import { Question } from '../../question/entities/question.entity';
import { ReplyLike } from '../../comment/entities/reply-likes.entity';
import { Product } from '../../product/entities/product.entity';
import { Shop } from '../../shop/entities/shop.entity';

export enum sexTypes {MALE = 'male', FEMALE = 'female', NOT_SPECIFIED = 'not specified'};

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: sexTypes,
    default: 'not specified',
  })
  @Exclude()
  sex: sexTypes;

  @Column({
    unique: true,
  })
  @Exclude()
  email: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Exclude()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.accounts)
  @JoinColumn({ name: 'user_id' })
  @Exclude()
  user: User;

  @OneToMany(() => Order, (order) => order.account, {onDelete: 'CASCADE'})
  @Exclude()
  orders: Order[];

  @OneToMany(() => Comment, (comment) => comment.account, {onDelete: 'CASCADE'})
  @Exclude()
  comments: Comment[];

  @OneToMany(() => Reply, (reply) => reply.account, {onDelete: 'CASCADE'})
  @Exclude()
  replies: Reply[];

  @OneToMany(() => Basket, (basket) => basket.account, {onDelete: 'CASCADE'})
  @Exclude()
  baskets: Basket[];

  @OneToMany(() => CommentLike, (commentLike) => commentLike.account, {onDelete: 'CASCADE'})
  @Exclude()
  commentLikes: CommentLike[];

  @OneToMany(() => ReplyLike, (replyLike) => replyLike.account, {onDelete: 'CASCADE'})
  @Exclude()
  replyLikes: ReplyLike[];

  @OneToMany(() => Question, (question) => question.account, {onDelete: 'CASCADE'})
  @Exclude()
  questions: Question[];

  @ManyToMany(() => Product, (product) => product.accountLikes)
  @Exclude()
  productLikes: Product[];

  @ManyToMany(() => Shop, (shop) => shop.accountLikes)
  @Exclude()
  shopLikes: Shop[];
}
