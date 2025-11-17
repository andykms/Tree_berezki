import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import { Param } from './param.entity';

@Entity()
export class ProductParam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @ManyToOne(() => Product, (product) => product.params)
  product: Product;

  @ManyToOne(() => Param, (param) => param.productParams)
  param: Param;
}
