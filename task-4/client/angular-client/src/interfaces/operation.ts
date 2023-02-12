export interface Operation {
  accountNumber: number;
  operation: {
    type: 'withdraw' | 'deposit' | 'loan';
    amount: number;
    operationDate: string;
    interestRate?: number;
    numberOfPayments?: number;
  };
}

export interface OperationErrors {
  accountNumberError: string;
  amountError: string;
  interestRateError: string;
  numberofPaymentsError: string;
}
