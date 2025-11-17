import {
  OneToMany,
  BeforeInsert,
  ManyToOne,
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ShowcaseProducts } from './showcase-products.entity';
import * as bcrypt from 'bcrypt';

@Entity()
export class Shop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 128,
    unique: true,
  })
  name: string;

  @Column({
    type: 'decimal',
    precision: 2,
    scale: 1,
    default: 0,
  })
  rating: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column()
  email: string;

  @ManyToOne(() => User, (user) => user.shops)
  user: User;

  @Column({
    length: 128,
  })
  organization: string;

  @Column({
    length: 12,
  })
  INN: string;

  @Column({
    length: 13,
  })
  OGRN: string;

  @Column({
    length: 128,
  })
  country: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @Column({
    type: 'enum',
    enum: ['work', 'blocked', 'deleted'],
    default: 'work',
  })
  status: 'work' | 'blocked' | 'deleted';

  @OneToMany(
    () => ShowcaseProducts,
    (showcaseProducts) => showcaseProducts.shop,
    { onDelete: 'CASCADE' },
  )
  showcaseProducts: ShowcaseProducts[];
}
