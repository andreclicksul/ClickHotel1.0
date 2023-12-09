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

// user authenticate
export const loginRouterHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { login, password } = authenticateSchema.parse(request.body)

    const user = await prisma.tb_users.findUniqueOrThrow({
      select: {
        id: true,
        password: true,
        name: true,
        startTime: true,
        finishTime: true,
        sunday: true,
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
      },
      where: {
        email: login,
      },
    })

    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword || difTime(user.startTime, user.finishTime))
      throw new Error()

    // Entrar com as verificações de horário e dias da semana
    const token = app.jwt.sign({ id: user.id })

    reply.code(200).send({ msg: 'OK', token })
  } catch (error) {
    reply.code(401).send({ msg: 'Falha no Login', error })
  }
}

// read users
export const readUsersHandler = async (reply: FastifyReply) => {
  try {
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
      startTime,
      finishTime,
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
      inactive,
      lastchange,
      color,
      avatar,
      deleted,
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
        startTime,
        finishTime,
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
        inactive,
        lastchange,
        color,
        avatar,
        deleted,
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
