export interface Ioperation {
  accountNumber: number
  operation: {
    type: 'withdraw' | 'deposit' | 'loan'
    amount: number
    operationDate: Date
    interestRate?: number
    numberOfPayments?: number
  }
}
