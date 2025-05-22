import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import 'dotenv/config'
import accountsRouter from './routes/accounts'
import paymentsRouter from './routes/payments'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'

const app = express()

app.use(helmet())
app.use(cors())
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    if (req.headers['content-type'] !== 'application/json') {
      return res.status(415).json({
        error: 'Unsupported Media Type',
        message: 'Content-Type must be application/json',
      })
    }
  }
  next()
})
app.use(express.json())
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})
app.use('/api/accounts', accountsRouter)
app.use('/api/payments', paymentsRouter)

const swaggerDocument = YAML.load('./docs/openapi.yaml')
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

export default app
