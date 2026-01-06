import fastify from 'fastify'
import { env } from './env.js'
import { transactionsRoutes } from './routes/transactions.js'
import cookie from '@fastify/cookie'

// Instancia do fastify
const app = fastify()

// Pluging do fastify com suporte para cookies
app.register(cookie)

// 'Plugin' para conectar com as rotas, injentando o app na função das rotas
app.register(transactionsRoutes, {
  prefix: 'transaction',
})

app
  .listen({
    port: env.PORT,
  }).then(() => {
    console.log('HTTP Server is Running!')
  })
