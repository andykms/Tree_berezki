import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Param } from '../../param/entities/param.entity';

@Entity()
export class ProductParam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  value: string;

  @ManyToOne(() => Product, (product) => product.params)
  product: Product;

  @ManyToOne(() => Param, (param) => param.productParams)
  @JoinColumn()
  param: Param;
}
