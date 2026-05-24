export interface PriceQuery {
  currency: string
}

interface PairData {
  symbol: string,
  price: string
}

export interface PriceResponse {
  currency: string
  timestamp: string
  pairs: PairData[]
  count: number
}