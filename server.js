import 'module-alias/register'

import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import mongoose from 'mongoose'
import path from 'path'
import ejs from 'ejs'
import { mongoUri } from '@env'
import { createServer } from 'http'
import { port } from '@env'

mongoose.Promise = global.Promise
mongoose.set('debug', false)
mongoose.connect(
  mongoUri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (err) => {
    if (err) throw err
  }
)

const app = express()
const server = createServer(app)

// CORS config
const allowedOrigins = ['localhost']

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      if (!allowedOrigins.includes(new URL(origin)?.hostname)) {
        logger.info(`CORS: An unknown client made a request from ${origin}`)
        return callback(null, false)
      }
      return callback(null, true)
    }
  })
)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  express.json({
    limit: '50mb',
    verify: (req, res, buf) => {
      req.rawBody = buf
    }
  })
)
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieParser())
app.use(helmet())

app.use('/v1/users', require('./routes/v1/users').default)
app.use('/v1/offers', require('./routes/v1/offers').default)
app.use('/v1/applications', require('./routes/v1/applications').default)
app.use('/v1/auth', require('./routes/v1/auth').default)
app.use('/v1/recruiters', require('./routes/v1/recruiters').default)

app.use('/v1/media', express.static(`${__dirname}/media`))
app.get('/', (req, res) => {
  res.json({
    name: 'Moveout API Endpoints',
    version: 'v1'
  })
})
app.use((req, res) => {
  res.status(404).end('404')
})
console.clear()
console.info(`Server listening on:${port} | env: ${process.env.NODE_ENV}`)

server.listen(port)
