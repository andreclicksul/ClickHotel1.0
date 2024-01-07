/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt'
import { FastifyRequest, FastifyReply } from 'fastify'
import { app } from '../server'
import { prisma } from '../lib/prisma'
import { difTime } from '../lib/users'
import {
  createSchema,
  authenticateSchema,
  readUniqueSchema,
} from '../schemas/users'
import { findUserAuthentication } from '../middlewares/user.services'

// user authenticate
export const loginRouterHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { email, password } = authenticateSchema.parse(request.body)

    const registerUser = await prisma.tb_users.findMany({
      where: {
        email,
        deleted: false,
        inactive: false,
      },
      include: {
        tb_audits: {
          take: 2,
          orderBy: {
            id: 'desc',
          },
          select: {
            ipaccess: true,
            dtregister: true,
          },
        },
      },
    })

    if (registerUser.length === 0) throw new Error()

    const objectUser = registerUser[0]

    const { user, permissionDay, passwordHash } =
      await findUserAuthentication(objectUser)

    const checkPassword = await bcrypt.compare(password, passwordHash)

    if (
      !checkPassword ||
      !permissionDay ||
      difTime(user.starttime, user.finishtime)
    )
      throw new Error()

    const token = app.jwt.sign(user)

    reply.code(200).send({
      token,
      iduser: user.id,
      status: 200,
    })
  } catch (error) {
    reply.code(401).send({ status: 401, error })
  }
}

// read permissions user
export const readPermissionUserIdHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { id } = readUniqueSchema.parse(request.params)
    const user = await prisma.tb_users.findMany({
      where: {
        id,
      },
      include: {
        tb_audits: {
          take: 2,
          orderBy: {
            id: 'desc',
          },
          select: {
            ipaccess: true,
            dtregister: true,
          },
        },
      },
    })
    reply.code(200).send({ data: user })
  } catch (error) {
    reply.code(401).send({ status: 401, error })
  }
}

// read users
export const readUsersHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    console.log(request.user)
    const users = await prisma.tb_users.findMany()
    reply.code(200).send({ msg: 'Usuário OK', data: users })
  } catch (error) {
    reply.code(401).send({ msg: 'Não há registros inseridos', error })
  }
}

// read a user
export const readUserIdHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { id } = readUniqueSchema.parse(request.params)
    const user = await prisma.tb_users.findUniqueOrThrow({
      select: {
        id: true,
        user: true,
        name: true,
        email: true,
        dtregister: true,
        lastchange: true,
      },
      where: {
        id,
      },
    })
    reply.code(200).send({ msg: 'Usuário OK', data: user })
  } catch (error) {
    reply.code(401).send({ msg: 'Usuário não encontrado', error })
  }
}

// create user
export const createUserHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const {
      user,
      name,
      email,
      phone,
      password,
      starttime,
      finishtime,
      sunday,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      client,
      caduser,
      checklist,
      provider,
      audit,
      accountpay,
      accountreceive,
      financial,
      product,
      occupationmap,
      lastchange,
      color,
      avatar,
    } = createSchema.parse(request.body)

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    const createuser = await prisma.tb_users.create({
      data: {
        user,
        name,
        email,
        phone,
        password: passwordHash,
        starttime,
        finishtime,
        sunday,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        client,
        caduser,
        checklist,
        provider,
        audit,
        accountpay,
        accountreceive,
        financial,
        product,
        occupationmap,
        lastchange,
        color,
        avatar,
      },
    })
    reply.code(200).send({ msg: 'Usuário OK', data: createuser })
    // return { status: 200, createuser, typeErr: 'OK' }
  } catch (error: any) {
    const typeErr = error.meta.target.toString()
    const textErr = typeErr === 'email' ? 'E-mail' : 'Usuário'
    reply.code(401).send({
      msg: `${textErr} já cadastrado`,
      error,
    })
    // return { status: 401, error, typeErr: textErr }
  }
}
