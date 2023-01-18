import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  BaseEntity,
} from 'typeorm'
import { Vacation } from './Vacation'

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column({ unique: true })
  username: string

  @Column()
  password: string

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role

  @ManyToMany(() => Vacation, (vacation) => vacation.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'users-vacations',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'vacation_id',
      referencedColumnName: 'id',
    },
  })
  vacations: Vacation[]
}







