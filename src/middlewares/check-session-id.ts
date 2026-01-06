import type { FastifyReply, FastifyRequest } from 'fastify'

export function checkSessionId(req: FastifyRequest, res: FastifyReply) {
  const sessionId = req.cookies.sessionId

  if (!sessionId) {
    return res.status(401).send({ error: 'User unauthorized.' })
  }
}
