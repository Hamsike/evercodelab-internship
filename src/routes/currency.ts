import { Request, Response, Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { type Currency, GetCurrenciesResponse, GetCurrencyResponse, CreateCurrencyResponse, CreateCurrencyBody, UpdateCurrencyBody, UpdateCurrencyResponse, DeleteCurrencyResponse } from "../types/currency.js";
import { ErrorResponse } from "../types/error.js";

let currencies: Currency[] = []

const router = Router()
router.use(authMiddleware)

router.get('/', (_: Request, res: Response<GetCurrenciesResponse>) => {
  res.status(200).json({currencies, count: currencies.length})
})

router.get('/:id', (req: Request<{id: string}>, res: Response<GetCurrencyResponse | ErrorResponse>) => {
  const currency = currencies.find(c => c.id === req.params.id)

  if (!currency) {
    return res.status(404).json({error: 'Not Found', message: 'Currency not found'})
  }

  res.status(200).json({currency})
})

router.post('/', (req: Request<{}, {}, CreateCurrencyBody>, res: Response<CreateCurrencyResponse| ErrorResponse>) => {
  const {name, ticker} = req.body ?? {name: undefined, ticker: undefined}

  if (!name || !ticker) {
    return res.status(400).json({error: 'Bad Request', message: 'Name and ticker are required'})
  }

  const newCurrency: Currency = {
    id: String(currencies.length),
    name,
    ticker
  }

  currencies.push(newCurrency)

  res.status(201).json({currency: newCurrency})
})

router.put('/:id', (req: Request<{id: string}, {}, UpdateCurrencyBody>, res: Response<UpdateCurrencyResponse | ErrorResponse>) => {
  const currency = currencies.find(c => c.id === req.params.id)

  if (!currency) {
    return res.status(404).json({error: 'Not Found', message: 'Currency not found'})
  }

  const {name, ticker} = req.body ?? {name: undefined, ticker: undefined}

  if (name) currency.name = name
  if (ticker) currency.ticker = ticker

  res.status(200).json({currency})
})

router.delete('/:id', (req: Request<{id: string}>, res: Response<DeleteCurrencyResponse | ErrorResponse>) => {
  const currency = currencies.find(c => c.id === req.params.id)

  if (!currency) {
    return res.status(404).json({error: 'Not Found', message: 'Currency not found'})
  }

  currencies = currencies.filter(c => c.id === req.params.id)

  res.status(200).json({message: 'Currency removed'})
})

export default router