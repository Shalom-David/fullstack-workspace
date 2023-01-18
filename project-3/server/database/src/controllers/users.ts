import { CONSTANTS } from '../constants'
import { User } from '../entity/User'
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
  console.log(vacation)
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
  return await user.save()
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
  return await user.save()
}

export const findUsers = async (userId?: number): Promise<User[]> => {
  return await User.find({
    ...(userId ? { where: { id: userId } } : {}),
    relations: {
      vacations: true,
    },
  })
}

export const updateUser = async (
  userId: number,
  data: User
): Promise<boolean> => {
  const res = await User.update(userId, data)
  return res.affected ? true : false
}
