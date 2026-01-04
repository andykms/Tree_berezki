import {
  ManyToOne,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
} from 'typeorm';
import { Measure } from '../../product/entities/measure.entity';
import { Category } from './category.entity';

@Entity()
export class RequiredParam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  name: string;

  @ManyToOne(() => Measure, (measure) => measure.requiredParams)
  measure: Measure;

  @ManyToMany(() => Category, (category) => category.requiredParams)
  category: Category[];
}
