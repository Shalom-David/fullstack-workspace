import 'dotenv/config'
import express, { Application, Request, Response } from 'express'

import { AppDataSource } from './data-source'
import vacations from './routers/adminAuth'
import users from './routers/userAuth'
import cors from 'cors'
import { createDefaultAdmin } from './controllers/users'
;(async () => {
  try {
    await AppDataSource.initialize()
    console.log('successfully connected to database')
    createDefaultAdmin()
    const app: Application = express()
    app.use(
      cors({
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      })
    )
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())

    app.use('/admin', vacations)
    app.use('/', users)
    app.use((req: Request, res: Response) => {
      res.status(400).send('resource not found')
    })

    app.listen(+process.env.APP_PORT, () => {
      console.log(`server is listening on port ${process.env.APP_PORT}`)
    })
  } catch (error) {
    console.error(error)
  }
})()
