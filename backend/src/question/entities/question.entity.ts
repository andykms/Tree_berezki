import { PrimaryGeneratedColumn, Entity, Column, ManyToOne} from "typeorm";
import { Product } from "../../product/entities/product.entity";
import { Account } from "../../account/entities/account.entity";

@Entity()
export class Question {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  request: string;

  @Column({
    default: ""
  })
  response: string;

  @Column({
    type: "timestamp",
    default: ()=>"now()"
  })
  created_at: string;

  @ManyToOne(()=>Account, (account)=> account.questions)
  account: Account;

  @ManyToOne(()=> Product, (product) => product.questions) 
  product: Product;
}

