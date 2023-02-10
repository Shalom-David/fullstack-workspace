import { Request, Response, Router } from 'express'
import { validationResult } from 'express-validator'
import { CONSTANTS } from '../constants'
import {
  createVacation,
  deleteVacation,
  findVacations,
  updateVacation,
} from '../controllers/vacations'
import authenticateAdmin from '../middlewares/authenticateAdmin'
import {
  multerErrorHandler,
  upload,
} from '../middlewares/multipartFormDataHandler'
import { vacationFormValidator } from '../middlewares/formValidator'
import jwtVerify from '../middlewares/jwtVerify'
import vacationDataValidator from '../middlewares/vacationDataValidator'

const router: Router = Router()

router.post(
  '/add-vacation',
  [
    upload.single('image'),
    multerErrorHandler,
    vacationDataValidator,
    ...vacationFormValidator,
    jwtVerify,
    authenticateAdmin,
  ],
  async (req: Request, res: Response) => {
    try {
      const validationRes = validationResult(req)
      if (!validationRes.isEmpty()) {
        return res.status(400).send({ errors: validationRes.array() })
      }
      const newVacation = await createVacation(req.body, req.file)
      res.send(newVacation)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
)

router.delete(
  '/vacation/:id',
  [jwtVerify, authenticateAdmin],
  async (req: Request, res: Response) => {
    try {
      const isDeleted = await deleteVacation(+req.params.id)
      isDeleted ? res.send(req.params.id) : res.send('nothing removed')
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
)

router.patch(
  '/edit-vacation',
  [
    upload.single('image'),
    multerErrorHandler,
    vacationDataValidator,
    jwtVerify,
    authenticateAdmin,
  ],
  async (req: Request, res: Response) => {
    try {
      const { id } = req.query
      const responseData = await updateVacation(+id, req.file, req.body)
      responseData === CONSTANTS.ERRORS.NOT_FOUND_ERROR
        ? res.sendStatus(404)
        : res.send(responseData)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
)
router.get('/vacation/:id', async (req: Request, res: Response) => {
  try {
    const vacation = await findVacations(+req.params.id)
    vacation.length ? res.send(vacation) : res.sendStatus(404)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
})
router.get('/vacations', async (req: Request, res: Response) => {
  try {
    const vacation = await findVacations()
    vacation.length ? res.send(vacation) : res.sendStatus(404)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
})
export default router
