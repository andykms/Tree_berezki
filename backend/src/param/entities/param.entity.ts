import {
  OneToMany,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { Measure } from '../../measure/entities/measure.entity';
import { ProductParam } from '../../product/entities/product-param.entity';
import { Category } from '../../category/entities/category.entity';
import { Exclude } from 'class-transformer';

export enum EChoosenType {
  TRUE = 'true',
  FALSE = 'false',
}

@Entity()
export class Param {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  name: string;

  @Column({
    type: 'enum',
    enum: EChoosenType,
  })
  is_choosen: EChoosenType;

  @ManyToOne(() => Measure, (measure) => measure.params)
  @JoinColumn()
  measure: Measure;

  @OneToMany(() => ProductParam, (productParam) => productParam.param)
  @Exclude()
  productParams: ProductParam[];

  @ManyToMany(() => Category, (category) => category.params)
  @Exclude()
  categories: Category[];
}
