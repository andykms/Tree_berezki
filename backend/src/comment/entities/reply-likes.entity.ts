import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Account } from '../../account/entities/account.entity';
import { ETypeLikes } from './comment-likes.entity';
import { Reply } from './reply.entity';

@Entity()
export class ReplyLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account, (account) => account.replyLikes)
  account: Account;

  @ManyToOne(() => Reply, (reply) => reply.likes)
  reply: Reply;

  @Column({
    type: 'enum',
    enum: ETypeLikes,
  })
  type: ETypeLikes;
}
