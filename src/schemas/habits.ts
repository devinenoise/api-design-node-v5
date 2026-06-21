import { z } from 'zod'

export const createHabitSchema = z.object({
  name: z.string().min(1, 'Name is required'),
})

export const habitParamSchema = z.object({
  id: z.string(),
})
