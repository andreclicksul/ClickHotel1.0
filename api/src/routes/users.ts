/* eslint-disable prettier/prettier */
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { 
  loginRouterHandler, 
  readUsersHandler,  
  readUserIdHandler, 
  createUserHandler,
} from '../services/users'

export async function userRoutes(app: FastifyInstance) {
  // read users
  app.get('/readusers', async (request: FastifyRequest, reply: FastifyReply) => 
    await readUsersHandler(request, reply))

  // read a user
  app.get('/readuser/:id', async (request: FastifyRequest, reply: FastifyReply) => 
    await readUserIdHandler(request, reply))

  // create user
  app.post('/createuser', async (request: FastifyRequest, reply: FastifyReply) => 
    await createUserHandler(request, reply))

  // user authenticate
  app.post('/authenticate', async (request: FastifyRequest, reply: FastifyReply) => 
    await loginRouterHandler(request, reply))

}
