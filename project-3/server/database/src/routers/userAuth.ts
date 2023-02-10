import { Request, Response, Router } from 'express'
import { validationResult } from 'express-validator'
import { CONSTANTS } from '../constants'
import {
  createUser,
  findUserByName,
  findUsers,
  follow,
  unfollow,
  updateUser,
} from '../controllers/users'
import { findPaginatedVacations, findVacations } from '../controllers/vacations'
import { User } from '../entity/User'
import authenticateUser from '../middlewares/authenticateUser'
import { registerFormValidator } from '../middlewares/formValidator'
import jwtSign from '../middlewares/jwtSign'
import jwtVerify from '../middlewares/jwtVerify'
import passwordEncryptor from '../middlewares/passwordEncryptor'
import passwordValidator from '../middlewares/passwordValidator'
import userLoginValidator from '../middlewares/userLoginValidator'
import userDataValidator from '../middlewares/userDataValidator'
import { Vacation } from '../entity/Vacation'

const router: Router = Router()

router.get(
  '/getUser',
  [jwtVerify, authenticateUser, jwtSign],
  async (req: Request, res: Response) => {
    try {
      const { username } = req.query

      const users = await findUsers()
      const [user] = users.filter((user) => user.username === username)

      user ? res.send(user) : res.sendStatus(404)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
)

router.post(
  '/follow/:id',
  [jwtVerify, authenticateUser, jwtSign],
  async (req: Request, res: Response) => {
    try {
      const { action } = req.query
      let vacation: Vacation[]
      switch (action) {
        case 'unfollow':
          await unfollow({
            vacation: +req.params.id,
            id: res.locals.user.id,
          })
          vacation = await findVacations(+req.params.id, true)

          res.cookie('auth-token', `bearer ${res.locals.accessToken}`, {
            httpOnly: true,
            maxAge: 90000000,
            sameSite: 'strict',
            path: '/',
          })
          res.send(vacation)
          break
        case 'follow':
          await follow({
            vacation: +req.params.id,
            id: res.locals.user.id,
          })
          vacation = await findVacations(+req.params.id, true)

          res.cookie('auth-token', `bearer ${res.locals.accessToken}`, {
            httpOnly: true,
            maxAge: 90000000,
            sameSite: 'strict',
            path: '/',
          })
          res.send(vacation)
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
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    try {
      const validationRes = validationResult(req)
      if (!validationRes.isEmpty()) {
        return res.status(400).send({ errors: validationRes.array() })
      }
      const user = await findUserByName(res.locals.username)
      res.cookie('auth-token', `bearer ${res.locals.accessToken}`, {
        httpOnly: true,
        maxAge: 90000000,
        sameSite: 'strict',
        path: '/',
      })

      res.send({
        message: `${res.locals.userRole} ${res.locals.username} ${CONSTANTS.SUCCESS_MESSAGES.LOGIN_SUCCESS}`,
        user: user,
      })
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
)
router.post('/logout', [jwtVerify], async (req: Request, res: Response) => {
  try {
    res.clearCookie('auth-token')
    res.send({ message: 'logged out' })
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
})

router.get(
  '/followed-vacations',
  [jwtVerify, authenticateUser, jwtSign],
  async (req: Request, res: Response) => {
    try {
      const { username } = req.query

      const user = await findUserByName(username as string)
      const userVacations = user.vacations
      const vacationsList = await findVacations(undefined, true)
      const vacations = []
      for (const vacation of vacationsList) {
        for (const followedVacation of userVacations) {
          if (vacation.id === followedVacation.id) vacations.push(vacation)
        }
      }

      res.cookie('auth-token', `bearer ${res.locals.accessToken}`, {
        httpOnly: true,
        maxAge: 90000000,
        sameSite: 'strict',
        path: '/',
      })

      vacations.length ? res.send(vacations) : res.sendStatus(404)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
)

router.get(
  '/all-followed-vacations',
  [jwtVerify, authenticateUser, jwtSign],
  async (req: Request, res: Response) => {
    try {
      const vacations = await findVacations()
      const filteredVacations = vacations.filter(
        (vacation) => vacation.users.length
      )
      res.cookie('auth-token', `bearer ${res.locals.accessToken}`, {
        httpOnly: true,
        maxAge: 90000000,
        sameSite: 'strict',
        path: '/',
      })
      filteredVacations.length
        ? res.send(filteredVacations)
        : res.sendStatus(404)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
)
router.get(
  '/paginated-vacations',
  [jwtVerify, authenticateUser, jwtSign],
  async (req: Request, res: Response) => {
    try {
      const { page } = req.query
      const vacations = await findPaginatedVacations((+page - 1) * 9, 9)
      res.cookie('auth-token', `bearer ${res.locals.accessToken}`, {
        httpOnly: true,
        maxAge: 90000000,
        sameSite: 'strict',
        path: '/',
      })
      vacations[1] ? res.send(vacations) : res.sendStatus(404)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
)

router.patch(
  '/edit-profile',
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
      const { username } = req.query
      const user = await findUserByName(username as string)
      let newUser = req.body
      if (req.body.password) {
        newUser = { ...req.body, password: res.locals.password }
        res.clearCookie('auth-token')
      }
      if (req.body.username) {
        res.locals.username = req.body.username
        res.clearCookie('auth-token')
      }

      const isUpdated = await updateUser(user.id, newUser)
      const updatedUser = await findUsers(user.id)
      isUpdated ? res.send(updatedUser) : res.send('nothing updated')
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
)

export default router
