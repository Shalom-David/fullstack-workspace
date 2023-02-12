import 'dotenv/config'
import express, { Application, Request, Response } from 'express'
import mongoose, { connect } from 'mongoose'
import cors from 'cors'

import operations from './routes/accountOperations'

mongoose.set('strictQuery', false)
const mongoUrl = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.DB_NAME}?authSource=admin`

connect(mongoUrl)
  .then(() => console.log('successfully connected to mongodb'))
  .catch((error) => console.error(error))

const app: Application = express()

app.use(express.json())
app.use(cors())
app.use('/operations', operations)

app.use((req: Request, res: Response) => {
  res.sendStatus(404).send('resource not found')
})

app.listen(process.env.APP_PORT, () =>
  console.log(`server is listening on port ${process.env.APP_PORT}`)
)
