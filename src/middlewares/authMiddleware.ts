import { Request, Response, NextFunction } from 'express'
import { ErrorResponse } from '../types/error.js'

export const authMiddleware = (req: Request, res: Response<ErrorResponse>, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized', 
      message: 'Missing or invalid authorization header format' 
    })
  }

  const curToken = authHeader.split(' ')[1]
  const VALID_TOKEN = process.env.AUTH_TOKEN
  
  if (curToken !== VALID_TOKEN) {
    return res.status(403).json({
      error: 'Forbidden',
      message: "Invalid authorization token"
    })
  }
  next()
}