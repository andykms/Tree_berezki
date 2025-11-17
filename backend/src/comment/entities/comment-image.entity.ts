import {
  ManyToOne,
  JoinColumn,
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { Comment } from './comment.entity';

@Entity()
export class CommentImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => Comment, (comment) => comment.images)
  @JoinColumn({ name: 'comment_id' })
  comment: Comment;
}
