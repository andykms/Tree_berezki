import * as bcrypt from "bcrypt";

import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert } from "typeorm";
import { Account } from "../../account/entities/account.entity";
import { Shop } from "../../shop/entities/shop.entity";


@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  password: string;

  @BeforeInsert()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
  }

  @Column()
  phone: string;

  @OneToMany(() => Account, account => account.user)
  accounts: Account[];

  @OneToMany(() => Shop, shop => shop.user)
  shops: Shop[];
}
