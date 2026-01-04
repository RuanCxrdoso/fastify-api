import fastify from 'fastify'
import { db } from './database.js'
import { randomUUID } from 'node:crypto'
import { env } from './env.js'

const app = fastify()

app.get('/users', () => {
  return 'Hello World'
})

app.post('/transaction', async () => {
  const transaction = await db('transactions').insert({
    id: randomUUID(),
    title: 'Send 650$',
    amount: 650.00,
  }).returning('*')

  return transaction
})

app.get('/transaction', async () => {
  const transaction = await db('transactions')
    .where('amount', 50)
    .select()

  return transaction
})

app
  .listen({
    port: env.PORT,
  }).then(() => {
    console.log('HTTP Server is Running!')
  })
