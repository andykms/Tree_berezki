import {
  ManyToOne,
  OneToMany,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  ManyToMany
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ProductParam } from './product-param.entity';
import { Category } from '../../category/entities/category.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { ShowcaseProducts } from '../../shop/entities/showcase-products.entity';
import { ProductImage } from './product-image.entity';
import { Basket } from '../../basket/entities/basket.entity';
import { Question } from '../../question/entities/question.entity';
import { Account } from '../../account/entities/account.entity';

export enum EProductStatus {
  SALED = "saled",
  BLOCKED = "blocked",
  DELETED = "deleted"
}


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
    enum: EProductStatus,
    default: 'saled',
  })
  status: EProductStatus;

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
  @Exclude()
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
  @Exclude()
  baskets: Basket[];

  @OneToMany(()=> Question, (question) => question.product, { onDelete: 'CASCADE' })
  @Exclude()
  questions: Question[];

  @ManyToMany(() => Account, (account) => account.productLikes)
  @Exclude()
  accountLikes: Account[];
}
