import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { ErrorResponse } from '../types/error.js'

export const authMiddleware = (req: Request, res: Response<ErrorResponse>, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized', 
      message: 'Missing or invalid authorization header format' 
    })
  }

  const token = authHeader.split(' ')[1]
  const JWT_SECRET = process.env.JWT_SECRET

  try {
    jwt.verify(token, JWT_SECRET)
    next()
  } catch (err) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid or expired authorization token'
    })
  }
}
