import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.resolve(process.cwd(), 'data', 'currencies.db')
const db = new Database(dbPath)

db.exec(`
  CREATE TABLE IF NOT EXISTS currencies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    ticker TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

export interface CurrencyRow {
  id: number
  name: string
  ticker: string
  created_at: string
  updated_at: string
}

export default db