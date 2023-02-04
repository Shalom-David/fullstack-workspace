import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
} from 'typeorm'
import { User } from './User'

enum Currency {
  EUR = '€',
  USD = '$',
  ILS = '₪',
}

@Entity('vacations')
export class Vacation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255 })
  description: string

  @Column({ type: 'varchar', length: 50 })
  destination: string

  @Column({ unique: true })
  imgName: string

  @Column({ type: 'date' })
  startDate: Date

  @Column({ type: 'date' })
  endDate: Date

  @Column()
  price: number

  @Column({ type: 'enum', enum: Currency })
  currency: Currency

  @ManyToMany(() => User, (user) => user.vacations, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  users: User[]
}
