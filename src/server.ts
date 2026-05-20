import express from 'express'
import { createLogger } from './utils/logger'
import routerRoot from './routes'

const app = express()
const PORT = process.env.PORT ?? 3000
const logger = createLogger('Server')

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/', routerRoot)

app.use((_, res) => {
  res.status(404).json({error: 'Not found'})
})

export function startServer() {
  app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`)
  })
}

export default app