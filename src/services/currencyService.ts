import { Currency } from "../types/currency.js";

let currencies: Currency[] = []
let nextId = 1

const currencyService = {
  getAll(): Currency[] {
    return currencies
  },

  getById(id: string): Currency {
    return currencies.find(c => c.id === id)
  },

  existsByTicker(ticker: string): boolean {
    return currencies.some(c => c.ticker === ticker)
  },

  create(name: string, ticker: string): Currency {
    const newCurrency: Currency = {
      id: String(nextId++),
      name,
      ticker: ticker.toUpperCase()
    }
    currencies.push(newCurrency)
    return newCurrency
  },

  update(id: string, data: Partial<Currency>) {
    const currency = currencyService.getById(id)
    if (!currency) return

    const { name, ticker } = data
    if (name) currency.name = name
    if (ticker) currency.ticker = ticker.toUpperCase()
  },

  delete(id: string) {
    currencies = currencies.filter(c => c.id !== id)
  }
}

export default currencyService