import db from '../../src/db/database.js'

export const clearCurrenciesTable = () => {
  db.prepare('DELETE FROM currencies').run()
  db.prepare("DELETE FROM sqlite_sequence WHERE name='currencies'").run()
}