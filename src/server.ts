import express from 'express'
import habitRoutes from './routes/habitRoutes.ts'
import userRoutes from './routes/userRoutes.ts'
import authRoutes from './routes/authRoutes.ts'

const app = express()

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
