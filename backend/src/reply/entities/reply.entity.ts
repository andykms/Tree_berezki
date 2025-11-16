import { ManyToOne, Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Comment } from "../../comment/entities/comment.entity";
import { Account } from "../../account/entities/account.entity";

@Entity()
export class Reply {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  text: string;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP"
  })
  created_at: Date;

  @ManyToOne(() => Comment, (comment) => comment.replies)
  comment: Comment;

  @ManyToOne(() => Account, (account) => account.replies)
  account: Account;
}
