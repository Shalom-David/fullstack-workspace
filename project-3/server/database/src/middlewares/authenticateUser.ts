import { Request, Response, NextFunction } from 'express'
import { Role } from '../entity/User'

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.url.split('?')[0] === '/follow') {
      if (res.locals.user.role === Role.USER) {
        return next()
      }
    } else if (
      res.locals.user.role === Role.ADMIN ||
      res.locals.user.role === Role.USER
    ) {
      return next()
    }

    res.status(403).send({ errors: ['you do not have permissions'] })
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}
