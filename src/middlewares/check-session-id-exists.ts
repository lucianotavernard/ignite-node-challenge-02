import { FastifyReply as Reply, FastifyRequest as Request } from 'fastify'

export async function checkSessionIdExists(request: Request, reply: Reply) {
  const sessionId = request.cookies.sessionId

  if (!sessionId) {
    return reply.status(401).send({ error: 'Unauthorized.' })
  }
}
