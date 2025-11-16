import { ManyToOne,OneToMany, Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { ProductParam } from "./product-param.entity";
import { Order } from "../../order/entities/order.entity";
import { Category } from "../../category/entities/category.entity";
import { Comment } from "../../comment/entities/comment.entity";
import { ShowcaseProducts } from "../../shop/entities/showcase-products.entity";
import { ProductImage } from "./product-image.entity";
import { Basket } from "../../basket/entities/basket.entity";

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({
    type: "decimal",
    precision: 5,
    scale: 2,
  })
  price_rubles: number;

  @Column({
    type: "decimal",
    precision: 5,
    scale: 2,
  })
  discount: number;

  @Column({
    length: 1024,
    default: ""
  })
  description: string;

  @Column({
    default: 0
  })
  count: number;

  @Column({
    unique: true
  })
  article: string;
  
  @OneToMany(() => ProductParam, (productParam) => productParam.product)
  params: ProductParam[];

  @ManyToMany(() => Order, (order) => order.products)
  orders: Order[];

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @OneToMany(() => Comment, (comment) => comment.product)
  comments: Comment[];

  @ManyToOne(() => ShowcaseProducts, (showcaseProducts) => showcaseProducts.products)
  showcaseProducts: ShowcaseProducts;

  @OneToMany(() => ProductImage, (productImage) => productImage.product)
  images: ProductImage[];

  @OneToMany(() => Basket, (basket) => basket.product)
  baskets: Basket[];
}
