import { ManyToOne, OneToMany, Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../../product/entities/product.entity";
import { Account } from "../../account/entities/account.entity";
import { Reply } from "../../reply/entities/reply.entity";
import { CommentImage } from "./comment-image.entity";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "decimal",
    precision: 2,
    scale: 1,
    default: "0.0"
  })
  rating: number;

  @Column({
    length: 512
  })
  advantage: string;

  @Column({
    length: 512
  })
  disadvantage: string;

  @Column({
    length: 512
  })
  comment: string;

  @Column({
    default: () => "CURRENT_TIMESTAMP"
  })
  created_at: Date;

  @Column({
    default: 0
  })
  likes: number;

  @Column({
    default: 0
  })
  dislikes: number;

  @Column({
    default: 0
  })
  replies_count: number;

  @OneToMany(() => Product, (product) => product.comments)
  product: Product;

  @ManyToOne(() => Account, (account) => account.comments)
  account: Account;

  @OneToMany(() => Reply, (reply) => reply.comment)
  replies: Reply[];

  @OneToMany(() => CommentImage, (image) => image.comment)
  images: CommentImage[];
}

