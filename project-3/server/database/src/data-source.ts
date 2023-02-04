import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from './entity/User'
import { Vacation } from './entity/Vacation'

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: +process.env.MYSQL_PORT,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Vacation],
  migrations: [],
  subscribers: [],
})
