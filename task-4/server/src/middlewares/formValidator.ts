import { body, query, ValidationChain } from 'express-validator'

const accountQueryValidator: ValidationChain[] = [
  query('accountNumber')
    .isNumeric()
    .isLength({ min: 6, max: 6 })
    .withMessage('invalid account number'),
]

const operatoinValidator: ValidationChain[] = [
  body('accountNumber')
    .isNumeric()
    .isLength({ min: 6, max: 6 })
    .withMessage('invalid account number'),
  body('operation.type')
    .isIn(['withdraw', 'deposit', 'loan'])
    .withMessage('invalid operation type'),
  body('operation.amount')
    .isNumeric()
    .isInt({ min: 50, max: 10000 })
    .withMessage('invalid amount'),
  body('operation.operationDate')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('invalid date'),
  body('operation.interestRate')
    .if(body('operation.type').equals('loan'))
    .isNumeric()
    .withMessage('invalid interest rate'),
  body('operation.numberOfPayments')
    .if(body('operation.type').equals('loan'))
    .isNumeric()
    .isInt({ min: 3, max: 72 })
    .withMessage('invalid number of payments'),
]

export { accountQueryValidator, operatoinValidator }
