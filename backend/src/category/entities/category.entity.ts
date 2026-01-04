import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { RequiredParam } from './required-param.entity';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  path: string;

  @ManyToMany(() => RequiredParam, (requiredParam) => requiredParam.category)
  requiredParams: RequiredParam[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
