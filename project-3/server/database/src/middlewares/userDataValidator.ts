import { Request, Response, NextFunction } from 'express'
import { findUsers } from '../controllers/users'
export default async (req: Request, res: Response, next: NextFunction) => {
  const matchedData = ['firstName', 'lastName', 'username', 'password', 'role']

  if (`${req.url.split('?')[0]}` === '/edit-profile') matchedData.pop()

  const users = await findUsers()
  const userExists = users.filter((user) => user.username === req.body.username)
  if (userExists.length) {
    return res.status(400).send({ error: 'username already in use' })
  }
  for (const key in req.body) {
    if (!matchedData.includes(key)) {
      return res.status(400).send({ errors: `[invalid property ${key}]` })
    }
  }

  next()
}
