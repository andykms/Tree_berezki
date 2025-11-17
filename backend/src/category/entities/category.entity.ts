import { ManyToOne, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { RequiredParam } from './required-param.entity';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  path: string;

  @ManyToOne(() => RequiredParam, (requiredParam) => requiredParam.category)
  requiredParams: RequiredParam;

  @ManyToOne(() => Product, (product) => product.category)
  products: Product[];
}
