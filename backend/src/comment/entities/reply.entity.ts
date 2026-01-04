import { ManyToOne, Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Comment } from './comment.entity';
import { Account } from '../../account/entities/account.entity';
import { ReplyLike } from './reply-likes.entity';

@Entity()
export class Reply {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @ManyToOne(() => Comment, (comment) => comment.replies)
  comment: Comment;

  @ManyToOne(() => Account, (account) => account.replies)
  account: Account;

  @OneToMany(() => ReplyLike, (replyLike) => replyLike.reply, {onDelete: 'CASCADE'})
  likes: ReplyLike[];

  @Column({
    default: 0,
  })
  replies_count: number;

  @Column({
    default: 0,
  })
  likes_count: number;

  @Column({
    default: 0,
  })
  dislikes_count: number;

  @Column({
    default: "",
  })
  parent_id: string;
}