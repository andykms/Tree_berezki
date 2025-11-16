import { OneToMany, OneToOne, ManyToOne, Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { LegalInfo } from "./legal-info.entity";
import { ShowcaseProducts } from "./showcase-products.entity";

@Entity()
export class Shop {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    length: 128,
    unique: true,
  })
  name: string;

  @Column({
    type: "decimal",
    precision: 2,
    scale: 1,
  })
  rating: number;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at: Date;

  @Column()
  email: string;

  @ManyToOne(() => User, (user) => user.shops)
  user: User;

  @OneToOne(() => LegalInfo, (legalInfo) => legalInfo.shop)
  legalInfo: LegalInfo;

  @OneToMany(() => ShowcaseProducts, (showcaseProducts) => showcaseProducts.shop)
  showcaseProducts: ShowcaseProducts[];
}
