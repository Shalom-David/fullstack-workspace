import { Request, Response, Router } from 'express'
import { cancelOrder, createOrder, findOrders } from '../controllers/orders'
import jwtSign from '../middlewares/jwtSign'
import jwtVerify from '../middlewares/jwtVerify'

const router: Router = Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const newOrder = await findOrders(req.headers.customeremail as string)
    newOrder ? res.send(newOrder) : res.sendStatus(404)
  } catch (error: any) {
    if (error.message === 'cart is empty')
      return res.status(400).send(error.message)
    res.sendStatus(500)
  }
})
router.post('/', async (req: Request, res: Response) => {
  try {
    const newOrder = await createOrder(req.body)
    newOrder ? res.send(newOrder) : res.sendStatus(400)
  } catch (error: any) {
    if (error.message === 'cart is empty')
      return res.status(400).send(error.message)
    res.sendStatus(500)
  }
})
router.patch('/', async (req: Request, res: Response) => {
  try {
    const newOrder = await cancelOrder(req.body.orderId)
    newOrder ? res.send(newOrder) : res.sendStatus(400)
  } catch (error: any) {
    if (error.message.includes('Cast to ObjectId failed'))
      return res.status(404).send('order not found')
    res.sendStatus(500)
  }
})

export default router
