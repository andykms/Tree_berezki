import {
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
} from 'typeorm';
import { Shop } from '../../shop/entities/shop.entity';
import { Product } from '../../product/entities/product.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class ShowcaseProducts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'decimal',
    precision: 2,
    scale: 1,
    default: 0,
  })
  rating: number;

  @ManyToOne(() => Shop, (shop) => shop.showcaseProducts)
  shop: Shop;

  @OneToMany(() => Product, (product) => product.showcaseProducts, {
    onDelete: 'CASCADE',
  })
  @Exclude()
  products: Product[];
}
