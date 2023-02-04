import { body, ValidationChain } from 'express-validator'

const registerFormValidator: ValidationChain[] = [
  body('firstName').notEmpty().withMessage('first name is required'),
  body('lastName').notEmpty().withMessage('last name is required'),
  body('username').notEmpty().withMessage('username is required'),
  body('password').notEmpty().withMessage('pasword is required'),
  body('role').isIn(['user', '', null]).withMessage('invalid role'),
]

const vacationFormValidator: ValidationChain[] = [
  body('description').notEmpty().withMessage('description is required'),
  body('destination').notEmpty().withMessage('destination is required'),
  body('startDate').notEmpty().isDate().withMessage('invalid date'),
  body('endDate').notEmpty().isDate().withMessage('invalid date'),
  body('price').isNumeric().withMessage('invalid price'),
  body('currency').isNumeric().isIn([1, 2, 3]).withMessage('invalid currency'),
]

export { registerFormValidator, vacationFormValidator }
