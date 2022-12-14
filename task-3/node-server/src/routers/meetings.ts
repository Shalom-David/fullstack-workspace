import { Request, Response, Router } from 'express'
import { find, save } from '../controllers/meetings'
const router: Router = Router()

router.post('/', async (req: Request, res: Response) => {
  try {
    const insertId: number | null = await save(req.body)
    insertId
      ? res.send(`meeting ${insertId} inserted`)
      : res.send('nothing inserted')
  } catch (error) {
    console.log(error)
    res.status(500)
  }
})

router.get('/:id', async (req: Request, res: Response) => {
    try {
      const meeting = await find(req.params.id)
      meeting.length ? res.send(meeting) : res.sendStatus(404)
    } catch (error) {
      console.log(error)
      res.status(500)
    }
  })
  
  router.get('/', async (req: Request, res: Response) => {
    try {
      const meeting = await find()
      meeting.length ? res.send(meeting) : res.sendStatus(404)
    } catch (error) {
      console.log(error)
      res.status(500)
    }
  })

export default router
