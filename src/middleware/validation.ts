import type { Request, Response, NextFunction } from 'express'
import { z, ZodError } from 'zod'

export const validateBody = <T>(schema: z.ZodType<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validateData = schema.parse(req.body)
      // Update req.body with the validated and parsed data
      req.body = validateData
      // If validation passes, proceed to the next middleware or route handler
      next()
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: e.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        })
      }
      next(e)
    }
  }
}

export const validateParams = <T>(schema: z.ZodType<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params)
      // If validation passes, proceed to the next middleware or route handler
      next()
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({
          error: 'Invalid parameters',
          details: e.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        })
      }
      next(e)
    }
  }
}

export const validateQuery = <T>(schema: z.ZodType<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query)
      // If validation passes, proceed to the next middleware or route handler
      next()
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({
          error: 'Invalid query parameters',
          details: e.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        })
      }
      next(e)
    }
  }
}
