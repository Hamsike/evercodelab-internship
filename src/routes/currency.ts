import { Request, Response, Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { type Currency, GetCurrenciesResponse, GetCurrencyResponse, CreateCurrencyResponse, CreateCurrencyBody, UpdateCurrencyBody, UpdateCurrencyResponse, DeleteCurrencyResponse } from "../types/currency.js";
import { ErrorResponse } from "../types/error.js";
import currencyService from "../services/currencyService.js";

const router = Router()
router.use(authMiddleware)

router.get('/', (_: Request, res: Response<GetCurrenciesResponse>) => {
  const currencies = currencyService.getAll()
  res.status(200).json({ currencies, count: currencies.length })
})

router.get('/:id', (req: Request<{ id: string }>, res: Response<GetCurrencyResponse | ErrorResponse>) => {
  const currency = currencyService.getById(req.params.id)

  if (!currency) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Currency not found'
    })
  }

  res.status(200).json({ currency })
})

router.post('/', (req: Request<{}, {}, CreateCurrencyBody>, res: Response<CreateCurrencyResponse | ErrorResponse>) => {
  const { name, ticker } = req.body ?? { name: undefined, ticker: undefined }

  if (!name || !ticker) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Name and ticker are required'
    })
  }

  const newCurrency = currencyService.create(name, ticker)
  res.status(201).json({ currency: newCurrency })
})

router.put('/:id', (req: Request<{ id: string }, {}, UpdateCurrencyBody>, res: Response<UpdateCurrencyResponse | ErrorResponse>) => {
  const { name, ticker } = req.body

  const updatedCurrency = currencyService.update(req.params.id, { name, ticker })

  if (!updatedCurrency) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Currency not found'
    })
  }

  res.status(200).json({ currency: updatedCurrency })
})

router.delete('/:id', (req: Request<{ id: string }>, res: Response<DeleteCurrencyResponse | ErrorResponse>) => {
  const deleted = currencyService.delete(req.params.id)

  if (!deleted) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Currency not found'
    })
  }

  res.status(200).json({ message: 'Currency removed' })
})

export default router
