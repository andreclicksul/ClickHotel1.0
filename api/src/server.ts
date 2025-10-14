import 'dotenv/config'
import fastify from 'fastify'
import cors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import { userRoutes } from './routes/users'
import { readPermissionSchema } from './schemas/users'
import { difTime } from './lib/users'

export const app = fastify()

const url = process.env.URL_TEST
const jwtsecret = process.env.JWT_SECRET

const authUrl: object = {
  '/readusers': true,
  '/readuser/:id': true,
  '/updateuser/:id': true,
  '/deleteuser/:id': true,
  '/createuser': true,
  '/readpermissionuser/:id': true,
  '/authenticate': false,
}

app.register(cors, {
  origin: [`${url}`], // ambiente de teste e de produção
  allowedHeaders: ['Content-Type', 'Authorization'],
})

app.register(userRoutes)

app.register(fastifyJwt, {
  secret: jwtsecret!,
})

app.addHook('onRequest', async (req, reply) => {

  const path: string = req.routerPath || ''

  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (authUrl[path]) {
      const payload = await req.jwtVerify()

      const { starthour, startminute, finishhour, finishminute } =
        readPermissionSchema.parse(payload)

      const isTimeRestricted = difTime(
        starthour,
        startminute,
        finishhour,
        finishminute,
      )

      if (isTimeRestricted) {
        return reply.code(403).send({ msg: 'Sessão encerrada', error: 'time restriction' })
      }
    }
  } catch (error) {
    return reply.code(403).send({ msg: 'Sessão encerrada', error })
  }
})

const PORT = process.env.NODE_DOCKER_PORT

app
  .listen({
    port: Number(PORT),
    host: '0.0.0.0',
  })
  .then(() => {
    console.log(` Server started on port ${PORT}!`)
  })
  .catch((e) => {
    console.log(`' Server stoped -> ${e}`)
  })
