import { Document } from 'mongoose'
import { Ioperation } from '../interfaces/accountOperations'
import { Operation } from '../models/accountOperation'

export const createOperation = async (
  doc: Ioperation
): Promise<Document<unknown, any, Ioperation>> => {
  try {
    const operation = new Operation(doc)
    return await operation.save()
  } catch (error) {
    console.error(error)
    throw Error(error as string)
  }
}

export const findAccountOperations = async (
  accountNumber: number
): Promise<Ioperation[]> => {
  return await Operation.find({ accountNumber: accountNumber })
}
