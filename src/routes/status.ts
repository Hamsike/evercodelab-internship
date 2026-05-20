import { Router, Request, Response } from "express";

const router = Router()

router.get('/status', (_: Request, res: Response) => {
  res.status(200).send('ok')
})

export default router