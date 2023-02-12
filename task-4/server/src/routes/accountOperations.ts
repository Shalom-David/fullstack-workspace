import { Request, Response, Router } from 'express'
import { validationResult } from 'express-validator'
import {
  createOperation,
  findAccountOperations,
} from '../controllers/accountOperations'
import {
  accountQueryValidator,
  operatoinValidator,
} from '../middlewares/formValidator'
import matchedData from '../middlewares/matchedData'

const router: Router = Router()

router.post(
  '/',
  [matchedData, ...operatoinValidator],
  async (req: Request, res: Response) => {
    try {
      const validationRes = validationResult(req)
      if (!validationRes.isEmpty()) {
        return res.status(400).send({ errors: validationRes.array() })
      }
      const newOperation = await createOperation(req.body)
      newOperation ? res.send(newOperation) : res.sendStatus(500)
    } catch (error) {
      res.status(500)
    }
  }
)

router.get(
  '/',
  [...accountQueryValidator],
  async (req: Request, res: Response) => {
    try {
      const validationRes = validationResult(req)

      if (!validationRes.isEmpty()) {
        return res.status(400).send({ errors: validationRes.array() })
      }
      const { accountNumber } = req.query

      const operations = await findAccountOperations(+(accountNumber as string))
      operations.length ? res.send(operations) : res.sendStatus(404)
    } catch (error) {
      console.error(error)
      res.status(500)
    }
  }
)

export default router
