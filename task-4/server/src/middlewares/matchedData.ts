import { Request, Response, NextFunction } from 'express'

export default async (req: Request, res: Response, next: NextFunction) => {
  const matchedData = ['type', 'amount', 'operationDate']
  console.log('nut');
  console.log(req.body);
  for (const key in req.body) {
    if (key === 'operation') {
      Object.entries(req.body.operation).forEach(([key, value]) => {
        if (value === 'loan')
          matchedData.push('interestRate', 'numberOfPayments')
        if (!matchedData.includes(key)) {
          return res.status(400).send({ errors: `[invalid property ${key}]` })
        }
      })
    }
    if (key !== 'operation' && key !== 'accountNumber') {
      return res.status(400).send({ errors: `[invalid property ${key}]` })
    }
  }
  next()
}
