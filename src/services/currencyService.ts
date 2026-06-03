import db, { CurrencyRow } from '../db/database.js'
import { Currency } from '../types/currency.js'

const toCurrency = (row: CurrencyRow): Currency => ({
  id: String(row.id),
  name: row.name,
  ticker: row.ticker
})

const currencyService = {
  getAll(): Currency[] {
    const stmt = db.prepare('SELECT * FROM currencies ORDER BY id ASC')
    const rows = stmt.all() as CurrencyRow[]
    return rows.map(toCurrency)
  },

  getById(id: string): Currency | undefined {
    const stmt = db.prepare('SELECT * FROM currencies WHERE id = ?')
    const row = stmt.get(Number(id)) as CurrencyRow | undefined
    return row ? toCurrency(row) : undefined
  },

  existsByTicker(ticker: string): boolean {
    const stmt = db.prepare('SELECT 1 FROM currencies WHERE ticker = ?')
    const result = stmt.get(ticker.toUpperCase())
    return !!result
  },

  create(name: string, ticker: string): Currency {
    const stmt = db.prepare(`
      INSERT INTO currencies (name, ticker) 
      VALUES (?, ?)
    `)
    const info = stmt.run(name, ticker.toUpperCase())
    
    return {
      id: String(info.lastInsertRowid),
      name,
      ticker: ticker.toUpperCase()
    }
  },

  update(id: string, data: Partial<Currency>): Currency | null {
    const currency = this.getById(id)
    if (!currency) return null

    const updates: string[] = []
    const values: any[] = []

    if (data.name !== undefined) {
      updates.push('name = ?')
      values.push(data.name)
    }
    if (data.ticker !== undefined) {
      updates.push('ticker = ?')
      values.push(data.ticker.toUpperCase())
    }

    if (updates.length === 0) return currency

    updates.push('updated_at = CURRENT_TIMESTAMP')
    const stmt = db.prepare(`
      UPDATE currencies 
      SET ${updates.join(', ')} 
      WHERE id = ?
    `)
    
    values.push(Number(id))
    stmt.run(...values)

    return this.getById(id)
  },

  delete(id: string): boolean {
    const stmt = db.prepare('DELETE FROM currencies WHERE id = ?')
    const result = stmt.run(Number(id))
    return result.changes > 0
  }
}

export default currencyService