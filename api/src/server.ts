import 'dotenv/config'
import fastify from 'fastify'
import cors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import { userRoutes } from './routes/users'
import { readPermissionUserIdHandler } from './services/users'

export const app = fastify()

const url = process.env.URL_TEST || 'http://localhost:3333'
const jwtsecret = process.env.JWT_SECRET

const authUrl: object = {
  '/readusers': true,
  '/readuser/:id': true,
  '/readpermissionuser/:id': true,
  '/createuser': true,
}

app.register(cors, {
  origin: [`${url}`], // ambiente de teste e de produção
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Accept',
    'Content-Type',
    'Authorization',
  ],
  methods: ['GET', 'PUT', 'POST', 'OPTIONS'],
})

app.register(userRoutes)

app.register(fastifyJwt, {
  secret: jwtsecret!,
})

app.addHook('onRequest', async (req, reply) => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const path: string = req.routeOptions.url
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (authUrl[path]) {
      readPermissionUserIdHandler(req, reply)
      await req.jwtVerify()
    }
  } catch (error) {
    reply.code(401).send({ msg: 'Sessão encerrada', error })
  }
})

const PORT = process.env.NODE_DOCKER_PORT || 3001

app
  .listen({
    port: Number(PORT),
  })
  .then(() => {
    console.log(` Server started on port ${PORT}!`)
  })
  .catch((e) => {
    console.log(`' Server stoped -> ${e}`)
  })
