import { genSalt, hash } from 'bcryptjs'
import { createUser, findUsers } from './users'
import { Role, User } from '../entity/User'

export const createAdmin = async () => {
  const users: User[] = await findUsers()
  const [userExists] = users.filter((user: User) => user.role === 'admin')
  if (!userExists) {
    const salt = await genSalt()
    const hashed = await hash(process.env.password, salt)
    return await createUser({
      firstName: process.env.firstName,
      lastName: process.env.lastName,
      username: process.env.user,
      password: hashed,
      role: Role.ADMIN,
    } as User)
  }
  return
}
