import { Request, Response, Router } from 'express'
import { createUser, findExistingUser, findUser } from '../controllers/users'
import { Iuser } from '../interfaces/user'
import jwtSign from '../middlewares/jwtSign'
import jwtVerify from '../middlewares/jwtVerify'
import passwordEncryptor from '../middlewares/passwordEncryptor'
import userLoginValidator from '../middlewares/userLoginValidator'
import passwordValidator from '../middlewares/passwordValidator'
const router: Router = Router()

router.get('/', [jwtVerify], async (req: Request, res: Response) => {
  try {
    const [user] = await findUser(req.headers.customeremail as string)
    user ? res.send(user) : res.sendStatus(404)
  } catch (error) {
    res.sendStatus(500)
  }
})

router.post('/checkEmail', async (req: Request, res: Response) => {
  try {
    const { email } = req.body
    const emailExists = await findExistingUser(email)
    res.status(200).send(emailExists)
  } catch (error: any) {
    res.status(error.status).send(error.message)
  }
})
router.post(
  '/register',
  [passwordValidator, passwordEncryptor, jwtSign],
  async (req: Request, res: Response) => {
    try {
      const user: Iuser = {
        ...req.body,
        password: res.locals.password,
      }

      const newUser = await createUser(user)
      console.log('as')
      console.log(newUser)
      newUser
        ? res.send({ user: newUser, token: res.locals.accessToken })
        : res.sendStatus(400)
    } catch (error: any) {
      console.log(error)
      res.status(error.status).send(error.message)
    }
  }
)
router.post(
  '/login',
  [userLoginValidator, jwtSign],
  async (req: Request, res: Response) => {
    try {
      const [user] = await findUser(res.locals.email)
      console.log(res.locals.accessToken)
      res.send({ user: user, token: res.locals.accessToken })
    } catch (error) {
      res.sendStatus(500)
    }
  }
)

export default router
