import 'dotenv/config'
import fastify from 'fastify'
import cors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import { userRoutes } from './routes/users'

export const app = fastify()

const url = process.env.URL_TEST
const jwtsecret = process.env.JWT_SECRET

const authUrl: object = {
  '/createuser': true,
  '/readusers': true,
  '/readuser/:id': true,
  '/readpermissionuser/:id': true,
}

/*
app.register(cors, {
  origin: [`${url}`,], // ambiente de teste e de produção
})
*/
app.register(cors, {
  origin: [`${url}`], // ambiente de teste e de produção
})

app.register(userRoutes)

app.register(fastifyJwt, {
  secret: jwtsecret!,
})

app.addHook('onRequest', async (req, reply) => {
  try {
    const path: string = req.routeOptions.url
    console.log(path)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (authUrl[path]) {
      await req.jwtVerify()
      // verificar as condições de dia da semana e horário para o token enviado
    }
  } catch (error) {
    reply.code(401).send({ msg: 'Sessão encerrada' })
  }
})

app
  .listen({
    port: Number(process.env.PORT),
  })
  .then(() => {
    console.log(' Server started!')
  })
  .catch((e) => {
    console.log(`' Server stoped -> ${e}`)
  })
