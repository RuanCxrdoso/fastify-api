import type { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { db } from '../database.js'
import { z } from 'zod'
import { checkSessionId } from '../middlewares/check-session-id.js'

export async function transactionsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (req) => {
    console.log(`${req.method} - ${req.url}`)
  })

  app.get('/', { preHandler: [checkSessionId] }, async (req, res) => {
    checkSessionId(req, res)

    const { sessionId } = req.cookies

    const transactions = await db('transactions')
      .where('session_id', sessionId)
      .select()

    return res.status(200).send({ transactions })
  })

  app.get('/:id', { preHandler: [checkSessionId] }, async (req, res) => {
    const getTransactionsParamsSchema = z.object({
      id: z.uuid(),
    })

    const { id } = getTransactionsParamsSchema.parse(req.params)
    const { sessionId } = req.cookies

    const transaction = await db('transactions').where({
      id,
      session_id: sessionId,
    }).first()

    return res.status(200).send({ transaction })
  })

  app.get('/summary', { preHandler: [checkSessionId] }, async (req, res) => {
    const { sessionId } = req.cookies

    const summary = await db('transactions')
      .where('session_id', sessionId)
      .sum('amount', { as: 'amount' })
      .first()

    return res.status(200).send({ summary })
  })

  app.post('/', async (req, res) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.coerce.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(req.body)

    // Criação de sessionId para identificar o usuário nas requisições
    let sessionId = req.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      res.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 3, // 3 dias
      })
    }

    await db('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    return res.status(201).send()
  })
}
