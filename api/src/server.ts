import 'dotenv/config'
import fastify from 'fastify'
import cors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import { userRoutes } from './routes/users'
import { readPermissionUserIdHandler } from './services/users'

export const app = fastify()

const url = process.env.URL_TEST
const jwtsecret = process.env.JWT_SECRET

const authUrl: object = {
  '/createuser': true,
  '/readusers': true,
  '/readuser/:id': true,
  '/readpermissionuser/:id': true,
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
  try {
    const path: string = req.routeOptions.url
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (authUrl[path]) {
      readPermissionUserIdHandler(req, reply)
      await req.jwtVerify()
    }
  } catch (error) {
    reply.code(401).send({ msg: 'Sessão encerrada' })
  }
})

const PORT = process.env.NODE_DOCKER_PORT || 3000

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
