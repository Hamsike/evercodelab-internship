import { Router, Request, Response } from "express";
import { PriceQuery, PriceResponse } from "../types/price.js";
import { ErrorResponse } from "../types/error.js";
import currencyService  from "../services/currencyService.js";
import { binanceService } from "../services/binanceService.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router()
router.use(authMiddleware)

router.get('/', async (req: Request<{}, {}, {}, PriceQuery>, res: Response<PriceResponse | ErrorResponse>) => {
  const { currency } = req.query

  if (!currency) {
    return res.status(400).json({
      error: 'Bad Request', 
      message: 'Bad Request'})
  }

  const ticker = currency.toUpperCase()

  if (!currencyService.existsByTicker(ticker)) {
    return res.status(404).json({
      error: 'Not Found', 
      message: `Currency with ticker ${ticker} not found`
    })
  }

  try {
    const pairs = await binanceService.getPricesByCurrency(ticker)

    res.status(200).json({
      currency: ticker,
      timestamp: new Date().toISOString(),
      pairs,
      count: pairs.length
    })
  }

  catch (err) {
    res.status(502).json({
      error: 'Bad Gateway',
      message: 'Failed to fetch data from Binance'
    })
  }
})

export default router