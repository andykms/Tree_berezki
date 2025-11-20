import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
  Generated,
} from 'typeorm';
import { Account } from '../../account/entities/account.entity';
import { OrderProduct } from './order-product';

export enum EOrderStatus {
  CREATED = 'created',
  PAID = 'paid',
  DELIVERED = 'delivered',
  CANCELED = 'canceled',
  ONTHEWAY = 'on the way',
}

export enum EDeliveryTime {
  MORNING = 'morning',
  AFTERNOON = 'afternoon',
  EVENING = 'evening',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  address: string;

  @Column({
    type: 'enum',
    enum: ['true', 'false'],
    default: 'false',
  })
  privateSector: 'true' | 'false';

  @Column()
  entrance: string;

  @Column()
  intercomCode: string;

  @Column()
  floor: string;

  @Column()
  flat: string;

  @Column({
    type: 'enum',
    enum: ['true', 'false'],
    default: 'false',
  })
  freightElevator: 'true' | 'false';

  @Column()
  comment: string;

  @Column()
  recipient: string;

  @Column()
  phone: string;

  @Column({
    default: null,
  })
  secondPhone: string;

  @Column()
  deliveryDate: Date;

  @Column({
    type: 'enum',
    enum: EDeliveryTime,
  })
  deliveryTime: EDeliveryTime;

  @Generated()
  uniq_id: number;

  @Column()
  total: number;

  @Column({
    default: 'created',
    type: 'enum',
    enum: EOrderStatus,
  })
  status: EOrderStatus;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @ManyToOne(() => Account, (account) => account.orders)
  account: Account;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
  products: OrderProduct[];
}
