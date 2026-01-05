import type { FastifyInstance } from 'fastify'
import { db } from '../database.js'
import { randomUUID } from 'node:crypto'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transaction = await db('transactions').select('*')

    return transaction
  })

  app.post('/', async () => {
    const transaction = await db('transactions').insert({
      id: randomUUID(),
      title: 'Send 650$',
      amount: 650.00,
    }).returning('*')

    return transaction
  })
}
