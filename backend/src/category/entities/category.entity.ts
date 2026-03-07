import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { Param } from '../../product/entities/param.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  path: string;

  @ManyToMany(() => Param, (param) => param.categories)
  params: Param[];

  @OneToMany(() => Product, (product) => product.category)
  @Exclude()
  products: Product[];
}
