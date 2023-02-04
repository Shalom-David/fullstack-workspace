import { genSalt, hash } from 'bcryptjs'
import { CONSTANTS } from '../constants'
import { Role, User } from '../entity/User'
import { findVacations } from './vacations'

export const createUser = async (record: User): Promise<User> => {
  const user = User.create(record)
  return await user.save()
}

export const follow = async (data: any): Promise<User | string | Error> => {
  if (!data.vacation || !data.id) {
    throw Error(CONSTANTS.ERRORS.MISSING_DATA_ERROR)
  }
  const { vacation: vacationId, id: userId } = data

  const [user] = await findUsers(userId)
  if (!user) {
    throw Error(CONSTANTS.ERRORS.NOT_FOUND_ERROR)
  }

  const vacation = await findVacations(vacationId)
  if (!vacation.length) {
    throw Error(CONSTANTS.ERRORS.NOT_FOUND_ERROR)
  }
  const index = user.vacations.findIndex(
    (vacation) => vacation.id === vacationId
  )
  if (index !== -1) {
    throw Error(CONSTANTS.ERRORS.FOLLOW_ERROR)
  }
  user.vacations.push(...vacation)
  await user.save()
  return
}

export const unfollow = async (data: any): Promise<User | string> => {
  if (!data.vacation || !data.id) {
    throw Error(CONSTANTS.ERRORS.MISSING_DATA_ERROR)
  }
  const { vacation: vacationId, id: userId } = data
  const [user] = await findUsers(userId)
  if (!user) {
    throw Error(CONSTANTS.ERRORS.NOT_FOUND_ERROR)
  }

  const index = user.vacations.findIndex(
    (vacation) => vacation.id === vacationId
  )
  if (index === -1) {
    throw Error(CONSTANTS.ERRORS.UNFOLLOW_ERROR)
  }
  user.vacations.splice(index, 1)
  await user.save()
  return
}

export const findUsers = async (userId?: number): Promise<User[]> => {
  return await User.find({
    ...(userId ? { where: { id: userId } } : {}),
    relations: {
      vacations: true,
    },
  })
}
export const findUserByName = async (username?: string): Promise<User> => {
  return await User.findOne({
    where: {
      username: username,
    },
    relations: ['vacations'],
  })
}

export const updateUser = async (
  userId: number,
  data: User
): Promise<boolean> => {
  const res = await User.update(userId, data)
  return res.affected ? true : false
}

export const createDefaultAdmin = async () => {
  // ############## default admin ##############
  // ############# username: admin #############
  // ############# password: admin #############
  const users: User[] = await findUsers()
  const [userExists] = users.filter((user: User) => user.role === 'admin')
  if (!userExists) {
    const salt = await genSalt()
    const hashed = await hash(CONSTANTS.ADMIN.PASSWORD, salt)
    return await createUser({
      firstName: CONSTANTS.ADMIN.FIRST_NAME,
      lastName: CONSTANTS.ADMIN.LAST_NAME,
      username: CONSTANTS.ADMIN.USERNAME,
      password: hashed,
      role: Role.ADMIN,
    } as User)
  }
  return
}
