import { FastifyInstance } from 'fastify'
import { randomUUID } from 'crypto'
import { z } from 'zod'

import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function snackRoutes(app: FastifyInstance) {
  app.get(
    '/summary',
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

      const summary = await knex('snack')
        .select(
          knex.raw('count(*) filter (where status = true) as totalInDiet'),
          knex.raw('count(*) filter (where status = false) as totalOutDiet'),
          knex.raw('count(*) as total'),
        )
        .where({ sessionId })
        .first()

      return { summary }
    },
  )

  app.get(
    '/',
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

      const snacks = await knex('snack').where({ userId: user.id })

      return {
        snacks,
      }
    },
  )

  app.get(
    '/:snackId',
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

      const getSnackParamsSchema = z.object({ snackId: z.string().uuid() })
      const { snackId } = getSnackParamsSchema.parse(request.params)

      const snack = await knex('snack')
        .where({ id: snackId, userId: user.id })
        .first()

      return {
        snack,
      }
    },
  )

  app.post(
    '/',
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

      const createUserBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        createdAt: z.string(),
        status: z.boolean().default(false),
      })

      const { name, description, createdAt, status } =
        createUserBodySchema.parse(request.body)

      await knex('snack').insert({
        id: randomUUID(),
        name,
        description,
        createdAt,
        status,
        userId: user.id,
      })

      return reply.status(201).send()
    },
  )

  app.put(
    '/:snackId',
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

      const getSnackParamsSchema = z.object({ snackId: z.string().uuid() })
      const { snackId } = getSnackParamsSchema.parse(request.params)

      const updateSnackBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        status: z.boolean().default(false),
      })

      const { name, description, status } = updateSnackBodySchema.parse(
        request.body,
      )

      await knex('snack')
        .update({ name, description, status })
        .where({ id: snackId, userId: user.id })

      return reply.status(201).send()
    },
  )

  app.delete(
    '/:snackId',
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

      const getSnackParamsSchema = z.object({ snackId: z.string().uuid() })
      const { snackId } = getSnackParamsSchema.parse(request.params)

      await knex('snack').delete().where({ id: snackId, userId: user.id })

      return reply.status(201).send()
    },
  )
}
