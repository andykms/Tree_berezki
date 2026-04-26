import * as bcrypt from 'bcrypt';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Account } from '../../account/entities/account.entity';
import { Shop } from '../../shop/entities/shop.entity';
import { UserSession } from './user-session.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Exclude()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @Column({
    unique: true,
  })
  phone: string;

  @OneToMany(() => UserSession, (session) => session.user)
  @Exclude()
  sessions: UserSession[];

  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];

  @OneToMany(() => Shop, (shop) => shop.user)
  shops: Shop[];
}

export interface ISessionInfo {
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  refreshToken: string;
}
