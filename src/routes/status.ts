import { Router, Request, Response } from "express";

const router = Router()

router.get('/', (_: Request, res: Response<string>) => {
  res.status(200).send('ok')
})

export default router