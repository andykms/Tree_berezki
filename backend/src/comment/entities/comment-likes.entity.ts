import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Comment } from './comment.entity';
import { Account } from '../../account/entities/account.entity';

export enum ETypeLikes {
  LIKE = 'like',
  DISLIKE = 'dislike',
}

@Entity()
export class CommentLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ETypeLikes,
  })
  type: ETypeLikes;

  @ManyToOne(() => Account, (account) => account.commentLikes)
  account: Account;

  @ManyToOne(() => Comment, (comment) => comment.likes)
  comment: Comment;
}
