import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from "typeorm";
import { Account } from "../../account/entities/account.entity";
import { Product } from "../../product/entities/product.entity";

export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  address: string;

  @Column({
    type: "enum",
    enum: ["true", "false"],
    default: "false"
  })
  privateSector: 'true' | 'false'

  @Column()
  entrance: string;

  @Column()
  intercomCode: string;

  @Column()
  floor: string;

  @Column()
  flat: string;

  @Column({
    type: "enum",
    enum: ["true", "false"],
    default: "false"
  })
  freightElevator: 'true' | 'false';

  @Column()
  comment: string;

  @Column()
  recipient: string;

  @Column()
  phone: string;

  @Column({
    default: null
  })
  secondPhone: string;

  @Column()
  delivaryDate: Date;

  @Column({
    type: "enum",
    enum: ["morning", "afternoon", "evening"],
  })
  delivaryTime: 'morning' | 'afternoon' | 'evening';

  @Column()
  uniq_id: string;

  @Column()
  total: number;

  @Column({
    default: "created"
  })
  status: string;

  @Column({
    default: () => "CURRENT_TIMESTAMP"
  })
  createdAt: Date;

  @ManyToOne(() => Account, account => account.orders)
  account: Account;

  @ManyToMany(() => Product, product => product.orders)
  products: Product[];
}
