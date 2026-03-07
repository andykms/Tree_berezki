import { OneToMany, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Param } from '../../param/entities/param.entity';

@Entity()
export class Measure {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @OneToMany(() => Param, (param) => param.measure)
  @Exclude()
  params: Param[];
}
