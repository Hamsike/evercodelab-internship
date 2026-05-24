import axios from 'axios'

interface BinancePrice {
  symbol: string
  price: string
}

export const binanceService = {
  async getAllPrices(): Promise<BinancePrice[]> {
    const response = await axios.get('https://api.binance.com/api/v3/ticker/price')
    return response.data
  },

  async getPricesByCurrency(ticker: string): Promise<BinancePrice[]> {
    const allPrices = await binanceService.getAllPrices()
    return allPrices.filter(p => p.symbol === ticker)
  }
}
