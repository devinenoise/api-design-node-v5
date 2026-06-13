import express from 'express'

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

export { app }

export default app
