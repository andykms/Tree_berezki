import { OneToMany,Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Param } from "./param.entity";
import { RequiredParam } from "../../category/entities/required-param.entity";

@Entity()
export class Measure {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @OneToMany(() => Param, (param) => param.measure)
  params: Param[];

  @OneToMany(() => RequiredParam, (requiredParam) => requiredParam.measure)
  requiredParams: RequiredParam[];
}