import { Request, Response, NextFunction } from 'express'
import { compare } from 'bcryptjs'
import { User } from '../entity/User'
import { findUsers } from '../controllers/users'
import { CONSTANTS } from '../constants'
export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users: User[] = await findUsers()
    const [userExists] = users.filter(
      (user: User) =>
        (req.url === '/login' || req.url === '/login/') &&
        user.username === req.body.username
    )

    let isValidPassword: boolean
    if (userExists) {
      res.locals.userRole = userExists.role
      res.locals.username = userExists.username
      isValidPassword = await compare(req.body.password, userExists.password)
    }
    if (!isValidPassword) {
      if (req.url === '/login' || req.url === '/login/') {
        return res.status(400).send({ errors: [CONSTANTS.ERRORS.LOGIN_ERROR] })
      }
    }

    next()
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}
