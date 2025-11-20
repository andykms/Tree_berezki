import {
  ManyToOne,
  OneToMany,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { Account } from '../../account/entities/account.entity';
import { Reply } from '../../reply/entities/reply.entity';
import { CommentImage } from './comment-image.entity';
import { CommentLike } from './comment-likes.entity';

export enum EHidden {
  'true',
  'false',
}

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'integer',
  })
  rating: number;

  @Column({
    length: 512,
  })
  advantage: string;

  @Column({
    length: 512,
  })
  disadvantage: string;

  @Column({
    length: 512,
  })
  comment: string;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @OneToMany(() => CommentLike, (commentLike) => commentLike.comment)
  likes: CommentLike[];

  @Column({
    default: 0,
  })
  replies_count: number;

  @Column({
    type: 'enum',
    enum: EHidden,
    default: EHidden.false,
  })
  hidden: EHidden;

  @OneToMany(() => Product, (product) => product.comments)
  product: Product;

  @ManyToOne(() => Account, (account) => account.comments)
  account: Account;

  @OneToMany(() => Reply, (reply) => reply.comment)
  replies: Reply[];

  @OneToMany(() => CommentImage, (image) => image.comment)
  images: CommentImage[];
}
