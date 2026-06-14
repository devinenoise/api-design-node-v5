import { Router } from 'express'

const router = Router()

router.post('/register', (req, res) => {
  // Registration logic here
  res.status(201).json({ message: 'User registration endpoint' })
})

router.post('/login', (req, res) => {
  // Login logic here
  res.status(200).json({ message: 'User login endpoint' })
})

export { router }
export default router
