import fastify from 'fastify'
import { transactionsRoutes } from './routes/transactions.js'
import cookie from '@fastify/cookie'

// Instancia do fastify
export const app = fastify()

// Pluging do fastify com suporte para cookies
app.register(cookie)

// 'Plugin' para conectar com as rotas, injentando o app na função das rotas
app.register(transactionsRoutes, {
  prefix: 'transaction',
})
