import express from 'express'
import habitRoutes from './routes/habitRoutes.ts'
import userRoutes from './routes/userRoutes.ts'
import authRoutes from './routes/authRoutes.ts'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import { isTest } from '../env.ts'

const app = express()
// helmet helps secure Express apps by setting various HTTP headers
app.use(helmet())
// cors allows cross-origin requests, which is essential for frontend-backend communication in a web application
app.use(cors())
// Middleware to parse JSON bodies
app.use(express.json())
// Middleware to parse URL-encoded bodies and only looks at requests where the Content-Type header matches the type option
app.use(express.urlencoded({ extended: true }))
// morgan is a logging middleware that logs HTTP requests and responses, useful for debugging and monitoring
// skip logging in test environment to keep test output clean; logs are still available in dev and prod for debugging and monitoring purposes
app.use(
  morgan('dev', {
    skip: () => isTest(),
  }),
)

app.get('/health', (req, res) => {
  res
    .json({
      message: 'OK',
      timestamp: new Date().toISOString(),
      service: 'habit tracker app',
    })
    .status(200)
})

app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/habits', habitRoutes)

export { app }
export default app
