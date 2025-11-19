import {
  OneToMany,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Measure } from './measure.entity';
import { ProductParam } from './product-param.entity';

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
    enum: ['true', 'false'],
  })
  is_choosen: 'true' | 'false';

  @ManyToOne(() => Measure, (measure) => measure.params)
  measure: Measure;

  @OneToMany(() => ProductParam, (productParam) => productParam.param)
  productParams: ProductParam[];
}
