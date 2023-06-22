import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { userRoutes } from './routes/user'
import { snackRoutes } from './routes/snack'

export const app = fastify()

app.register(cookie)

app.register(userRoutes, { prefix: 'user' })
app.register(snackRoutes, { prefix: 'snack' })
