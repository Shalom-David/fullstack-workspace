import 'dotenv/config'
import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import meetings from './routers/meetings'
import teams from './routers/dev_teams'
const app: Application = express()

app.use(express.json())
app.use(cors())

app.use('/meetings', meetings)
app.use('/teams', teams)

app.use((req: Request, res: Response) => {
  res.status(400).send('resource not found')
})

app.listen(process.env.APP_PORT, () => {
  console.log(`server is listening on port ${process.env.APP_PORT}`)
})
