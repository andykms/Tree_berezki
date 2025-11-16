import { ManyToOne, Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Measure } from "../../product/entities/measure.entity";
import { Category } from "./category.entity";

@Entity()
export class RequiredParam {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Measure, (measure) => measure.requiredParams)
  measure: Measure;

  @ManyToOne(() => Category, (category) => category.requiredParams)
  category: Category;
}