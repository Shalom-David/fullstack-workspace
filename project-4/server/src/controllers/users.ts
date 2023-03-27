import { Document } from 'mongoose'
import { Iuser } from '../interfaces/user'
import { User } from '../models/user'
export const createUser = async (
  doc: Iuser
): Promise<Document<unknown, any, Iuser>> => {
  const existingUserByEmail = await findExistingUser(doc.email)
  if (existingUserByEmail) {
    throw { status: 400, nessage: 'Email already in use' }
  }
  // if (doc.role && doc.role === 'admin') {
  //   throw { status: 400, nessage: 'invalid role' }
  // }
  const user = new User(doc)
  return await user.save()
}
export const findUser = async (email: string): Promise<Iuser[]> => {
  return await User.find({ email: email })
}
export const findUsers = async (): Promise<Iuser[]> => {
  return await User.find()
}

export const findExistingUser = async (email: string): Promise<boolean> => {
  const userExists = await User.findOne({ email: email })
  if (userExists) return true
  else return false
}
