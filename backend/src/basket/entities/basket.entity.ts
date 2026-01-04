import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Account } from '../../account/entities/account.entity';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class Basket {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Account, (account) => account.baskets)
  account: Account;

  @ManyToOne(() => Product, (product) => product.baskets)
  product: Product;

  @Column()
  quantity: number;
}
