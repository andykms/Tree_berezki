/*import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

import { User } from "./user.entity";

@Entity()
export class UserSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ipAddress: string;

  @Column()
  userAgent: string;

  @Column()
  createdAt: Date;

  @Column()
  refreshToken: string;


  @ManyToOne(() => User, (user) => user.sessions)
  user: User;
}*/
