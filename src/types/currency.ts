export interface Currency {
  id: string
  name: string
  ticker: string
}

export interface GetCurrenciesResponse {
  currencies: Currency[]
  count: number
}

export interface GetCurrencyResponse {
  currency: Currency
}

export interface CreateCurrencyResponse {
  currency: Currency
}

export interface CreateCurrencyBody {
  name: string
  ticker: string
}

export interface UpdateCurrencyBody {
  name: string
  ticker: string
}

export interface UpdateCurrencyResponse {
  currency: Currency
}

export interface DeleteCurrencyResponse {
  message: string
}