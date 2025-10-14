/* eslint-disable prettier/prettier */
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { 
  loginRouterHandler, 
  readUsersHandler,  
  readUserIdHandler, 
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
  readPermissionUserIdHandler,
} from '../services/users'

export async function userRoutes(app: FastifyInstance) {
  // read users
  app.get('/readpermissionuser/:id', async (request: FastifyRequest, reply: FastifyReply) =>
    await readPermissionUserIdHandler(request, reply))

  app.get('/readusers', async (request: FastifyRequest, reply: FastifyReply) => 
    await readUsersHandler(request, reply))

  // read a user
  app.get('/readuser/:id', async (request: FastifyRequest, reply: FastifyReply) => 
    await readUserIdHandler(request, reply))

  // create user
  app.post('/createuser', async (request: FastifyRequest, reply: FastifyReply) => 
    await createUserHandler(request, reply))

  // update user
  app.put('/updateuser/:id', async (request: FastifyRequest, reply: FastifyReply) =>
    await updateUserHandler(request, reply))

  // soft delete user
  app.patch('/deleteuser/:id', async (request: FastifyRequest, reply: FastifyReply) =>
    await deleteUserHandler(request, reply))

  // Authenticate
  app.post('/authenticate', async (request: FastifyRequest, reply: FastifyReply) => 
    await loginRouterHandler(request, reply))
}
