import type { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { db } from '../database.js'
import { z } from 'zod'

export async function transactionsRoutes(app: FastifyInstance) {
  app.post('/', async (req, res) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.coerce.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(req.body)

    await db('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    })

    return res.status(201).send()
  })

  app.get('/', async () => {
    const transaction = await db('transactions').select('*')

    return transaction
  })
}
