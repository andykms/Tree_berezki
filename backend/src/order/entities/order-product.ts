import { Entity, ManyToOne, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  price_rubles: number;

  @Column()
  count: number;

  @Column({
    type: 'int64',
  })
  article: number;

  @Column()
  shopName: string;

  @Column({
    length: 1024,
  })
  imageUrl: string | null;

  @ManyToOne(() => Order, (order) => order.products)
  order: Order;
}
