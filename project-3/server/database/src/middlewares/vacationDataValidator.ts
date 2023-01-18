import { Request, Response, NextFunction } from 'express'
import { CONSTANTS } from '../constants'
import { findUsers } from '../controllers/users'
export default async (req: Request, res: Response, next: NextFunction) => {
  const matchedData = [
    'description',
    'destination',
    'startDate',
    'endDate',
    'price',
    'currency',
  ]
  if (
    !req.file &&
    (req.url === '/add-vacation' || req.url === '/add-vacation/')
  ) {
    return res.status(400).send({ error: CONSTANTS.ERRORS.MISSING_DATA_ERROR })
  }
  if (`/${req.url.split('/')[1]}` === '/edit-vacation') {
    matchedData.push('imgName')
  }
  for (const key in req.body) {
    if (!matchedData.includes(key)) {
      return res.status(400).send({ errors: `[invalid property ${key}]` })
    }
  }

  next()
}
