import { OneToOne, Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Shop } from "./shop.entity";

@Entity()
export class LegalInfo {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @OneToOne(() => Shop, (shop) => shop.legalInfo)
  shop: Shop;

  @Column({
    length: 128,
  })
  organization: string;

  @Column({
    length: 12
  })
  INN: string;

  @Column({
    length: 12,
  })
  OGRN: string;

  @Column({
    length: 128,
  })
  country: string;
}