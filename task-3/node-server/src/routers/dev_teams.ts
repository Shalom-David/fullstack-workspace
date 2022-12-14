import { Request, Response, Router } from 'express'
const router: Router = Router()
import db from '../db'

router.get('/', async (req: Request, res: Response) => {
  try {
    const query = `
        select * from dev_teams`

    const teams = await db.execute(query)
    teams.length ? res.send(teams[0]) : res.sendStatus(404)
  } catch (error) {
    console.log(error)
    res.status(500)
  }
})

export default router
