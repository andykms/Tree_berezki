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
import { Reply } from '../../comment/entities/reply.entity';
import { Basket } from '../../basket/entities/basket.entity';
import { CommentLike } from '../../comment/entities/comment-likes.entity';
import { Question } from '../../question/entities/question.entity';
import { ReplyLike } from '../../comment/entities/reply-likes.entity';

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
  sex: sexTypes;

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

  @OneToMany(() => Order, (order) => order.account, {onDelete: 'CASCADE'})
  orders: Order[];

  @OneToMany(() => Comment, (comment) => comment.account, {onDelete: 'CASCADE'})
  comments: Comment[];

  @OneToMany(() => Reply, (reply) => reply.account, {onDelete: 'CASCADE'})
  replies: Reply[];

  @OneToMany(() => Basket, (basket) => basket.account, {onDelete: 'CASCADE'})
  baskets: Basket[];

  @OneToMany(() => CommentLike, (commentLike) => commentLike.account, {onDelete: 'CASCADE'})
  commentLikes: CommentLike[];


  @OneToMany(() => ReplyLike, (replyLike) => replyLike.account, {onDelete: 'CASCADE'})
  replyLikes: ReplyLike[];

  @OneToMany(() => Question, (question) => question.account, {onDelete: 'CASCADE'})
  questions: Question[]
}
