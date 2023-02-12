import { model, Schema } from 'mongoose'
import { Ioperation } from '../interfaces/accountOperations'

const accountOperationSchema = new Schema<Ioperation>({
  accountNumber: { type: Number },
  operation: {
    type: { type: String, required: true },
    amount: { type: Number, required: true, min: 50, max: 10000 },
    operationDate: { type: Date, default: Date.now },
    interestRate: Number,
    numberOfPayments: Number,
  },
})

export const Operation = model<Ioperation>('Operation', accountOperationSchema)
