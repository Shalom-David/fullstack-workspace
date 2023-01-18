import { Request, Response, Router } from 'express'
import { validationResult } from 'express-validator'
import { CONSTANTS } from '../constants'
import {
  createUser,
  findUsers,
  follow,
  unfollow,
  updateUser,
} from '../controllers/users'
import { findVacations } from '../controllers/vacations'
import { User } from '../entity/User'
import authenticateUser from '../middlewares/authenticateUser'
import { registerFormValidator } from '../middlewares/formValidator'
import jwtSign from '../middlewares/jwtSign'
import jwtVerify from '../middlewares/jwtVerify'
import passwordEncryptor from '../middlewares/passwordEncryptor'
import passwordValidator from '../middlewares/passwordValidator'
import userLoginValidator from '../middlewares/userLoginValidator'
import userDataValidator from '../middlewares/userDataValidator'

const router: Router = Router()

router.get(
  '/getUser/:id',
  [jwtVerify, authenticateUser],
  async (req: Request, res: Response) => {
    try {
      const user = await findUsers(+req.params.id)
      user ? res.send(user) : res.sendStatus(404)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
)

router.post(
  '/follow',
  [jwtVerify, authenticateUser],
  async (req: Request, res: Response) => {
    try {
      const { action } = req.query
      let responseData: unknown
      switch (action) {
        case 'unfollow':
          responseData = await unfollow(req.body)
          res.send(responseData)
          break
        case 'follow':
          responseData = await follow(req.body)
          res.send(responseData)
          break
        default:
          res.sendStatus(404)
          break
      }
    } catch (error) {
      console.error(error)
      switch (error.message) {
        case CONSTANTS.ERRORS.MISSING_DATA_ERROR:
          res.status(404).send(error.message)
          break
        case CONSTANTS.ERRORS.NOT_FOUND_ERROR:
          res.status(404).send(error.message)
          break
        case CONSTANTS.ERRORS.FOLLOW_ERROR:
          res.status(401).send(error.message)
          break
        case CONSTANTS.ERRORS.UNFOLLOW_ERROR:
          res.status(401).send(error.message)
          break
        default:
          res.sendStatus(500)
          break
      }
    }
  }
)

router.post(
  '/register',
  [
    userDataValidator,
    ...registerFormValidator,
    passwordValidator,
    passwordEncryptor,
  ],
  async (req: Request, res: Response) => {
    try {
      const validationRes = validationResult(req)
      if (!validationRes.isEmpty()) {
        return res.status(400).send({ errors: validationRes.array() })
      }

      const newUser: User = {
        ...req.body,
        password: res.locals.password,
      }
      await createUser(newUser)

      res.send({ message: CONSTANTS.SUCCESS_MESSAGES.REGISTER_SUCCESS })
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
)

router.post(
  '/login',
  [userLoginValidator, jwtSign],
  async (req: Request, res: Response) => {
    try {
      const validationRes = validationResult(req)
      if (!validationRes.isEmpty()) {
        return res.status(400).send({ errors: validationRes.array() })
      }

      res.cookie('jwt', `bearer ${res.locals.accessToken}`, {
        httpOnly: true,
        maxAge: 600,
        sameSite: 'strict',
        path: '/',
      })
      console.log(res.locals.accessToken)
      res.send({ message: CONSTANTS.SUCCESS_MESSAGES.LOGIN_SUCCESS })
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
)
router.get(
  '/vacations',
  [jwtVerify, authenticateUser],
  async (req: Request, res: Response) => {
    try {
      const vacation = await findVacations()
      vacation.length ? res.send(vacation) : res.sendStatus(404)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
)

router.patch(
  '/edit-profile/:id',
  [
    userDataValidator,
    passwordValidator,
    passwordEncryptor,
    jwtVerify,
    authenticateUser,
    jwtSign,
  ],
  async (req: Request, res: Response) => {
    try {
      let newUser = req.body
      if (req.body.password) {
        newUser = { ...req.body, password: res.locals.password }
      }
      if (req.body.username) {
        res.cookie('jwt', `bearer ${res.locals.accessToken}`, {
          httpOnly: true,
          maxAge: 600,
          sameSite: 'strict',
          path: '/',
        })
      }
      const isUpdated = await updateUser(+req.params.id, newUser)
      isUpdated
        ? res.send(`user ${req.params.id} updated`)
        : res.send('nothing updated')
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
)

export default router
