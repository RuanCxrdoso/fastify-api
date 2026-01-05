import fastify from 'fastify'
import { env } from './env.js'
import { transactionsRoutes } from './routes/transactions.js'

const app = fastify()

app.register(transactionsRoutes, {
  prefix: 'transactions',
})

app
  .listen({
    port: env.PORT,
  }).then(() => {
    console.log('HTTP Server is Running!')
  })
