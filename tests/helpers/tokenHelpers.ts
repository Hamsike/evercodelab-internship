import jwt from 'jsonwebtoken'

export const generateValidToken = (payload: object): string => {
  const JWT_SECRET = process.env.JWT_SECRET
  const validToken = jwt.sign(
    payload,
    JWT_SECRET,
    {expiresIn: '1h'}
  )
  return validToken
}

export const generateExpiredToken = (payload: object): string => {
  const JWT_SECRET = process.env.JWT_SECRET
  const expiredToken = jwt.sign(
    payload,
    JWT_SECRET,
    {expiresIn: '-1h'}
  )
  return expiredToken
}