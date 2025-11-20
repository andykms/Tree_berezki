import {
  ManyToOne,
  OneToMany,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
} from 'typeorm';
import { ProductParam } from './product-param.entity';
import { Category } from '../../category/entities/category.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { ShowcaseProducts } from '../../shop/entities/showcase-products.entity';
import { ProductImage } from './product-image.entity';
import { Basket } from '../../basket/entities/basket.entity';

@Entity()
export class Product {
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

  @Column({
    type: 'integer',
    default: 0,
  })
  discount: number;

  @Column({
    length: 1024,
    default: '',
  })
  description: string;

  @Column({
    default: 0,
  })
  count: number;

  @Generated('increment')
  article: number;

  @Column({
    type: 'enum',
    enum: ['saled', 'blocked', 'deleted'],
    default: 'saled',
  })
  status: 'saled' | 'blocked' | 'deleted';

  @Column({
    default: 0,
  })
  purchase_count: number;

  @Column({
    type: 'timestamp',
    default: () => 'now()',
  })
  created_at: Date;

  @OneToMany(() => ProductParam, (productParam) => productParam.product)
  params: ProductParam[];

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @OneToMany(() => Comment, (comment) => comment.product, {
    onDelete: 'CASCADE',
  })
  comments: Comment[];

  @ManyToOne(
    () => ShowcaseProducts,
    (showcaseProducts) => showcaseProducts.products,
  )
  showcaseProducts: ShowcaseProducts;

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    onDelete: 'CASCADE',
  })
  images: ProductImage[];

  @OneToMany(() => Basket, (basket) => basket.product, { onDelete: 'CASCADE' })
  baskets: Basket[];
}
