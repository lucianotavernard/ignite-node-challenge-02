import { FastifyInstance } from 'fastify'
import { randomUUID } from 'crypto'
import { z } from 'zod'

import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function userRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      username: z.string(),
    })

    const { username } = createUserBodySchema.parse(request.body)

    let user = await knex('user').where({ username }).first()

    if (!user) {
      await knex('user').insert({
        id: randomUUID(),
        sessionId: randomUUID(),
        username,
      })

      user = await knex('user').where({ username }).first()
    }

    reply.setCookie('sessionId', user.sessionId, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    })

    return reply.status(201).send()
  })

  app.get(
    '/profile',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const sessionIdSchema = z.object({
        sessionId: z.string().uuid(),
      })

      const { sessionId } = sessionIdSchema.parse(request.cookies)

      const user = await knex('user').where({ sessionId }).first()

      if (!user) {
        return reply.status(403).send({ error: 'Session ID does not exist' })
      }

      return {
        user,
      }
    },
  )
}
