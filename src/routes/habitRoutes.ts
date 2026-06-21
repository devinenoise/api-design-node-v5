import { Router } from 'express'
import {
  validateBody,
  validateParams,
  validateQuery,
} from '../middleware/validation.ts'
import { createHabitSchema, habitParamSchema } from '../schemas/habits.ts'

const router = Router()

router.get('/', (req, res) => {
  // Fetch habits logic here
  res.json({ message: 'User habits endpoint' })
})

router.get('/:id', (req, res) => {
  // Fetch single habit logic here
  res.json({ message: 'User habit fetch endpoint' })
})

router.post('/', validateBody(createHabitSchema), (req, res) => {
  // Create habit logic here
  res.json({ message: 'User habit creation endpoint' })
})

router.delete('/:id', validateParams(habitParamSchema), (req, res) => {
  // Delete habit logic here
  res.json({ message: 'User habit deletion endpoint' })
})

router.post(
  '/:id/complete',
  validateParams(habitParamSchema),
  validateBody(createHabitSchema),
  (req, res) => {
    // Mark habit as complete logic here
    res.json({ message: 'User habit completion endpoint' })
  },
)

export default router
