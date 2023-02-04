import { Request, Response, NextFunction } from 'express'
import jwt, { VerifyErrors } from 'jsonwebtoken'
import { findUsers } from '../controllers/users'

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = decodeURIComponent(req.headers.cookie)
    if (!authHeader) {
      return res.sendStatus(401)
    }
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
      return res.sendStatus(401)
    }
    if (!process.env.ACCESS_TOKEN_SECRET) {
      return res.sendStatus(500)
    }

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err: VerifyErrors | null, decoded: any) => {
        if (err) {
          return res.sendStatus(403)
        }
        const { username } = decoded

        const users = await findUsers()

        const [user] = users.filter((user) => user.username === username)

        if (!user) {
          return res.sendStatus(403)
        }
        res.locals.user = user
        next()
      }
    )
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}
