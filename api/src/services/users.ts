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
  readPermissionSchema,
} from '../schemas/users'
import { findUserAuthentication } from '../middlewares/user.services'

export const loginRouterHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { email, password } = authenticateSchema.parse(request.body)

    const registerUser = await prisma.tb_users.findFirst({
      where: {
        email,
        deleted: false,
        inactive: false,
      },
      include: {
        tb_audits: {
          take: 2,
          orderBy: { dtregister: 'desc' },
          select: {
            ipaccess: true,
            dtregister: true,
          },
        },
      },
      relationLoadStrategy: 'query',
    })

    if (!registerUser) throw new Error('erro1')

    const objectUser = registerUser

    const { user, isPermission, passwordHash } =
      await findUserAuthentication(objectUser)

    if (
      !(await bcrypt.compare(password, passwordHash)) ||
      !isPermission ||
      difTime(
        user.starthour,
        user.startminute,
        user.finishhour,
        user.finishminute,
      )
    ) {
      throw new Error(
        `Authentication failed. 
        Password is incorrect: ${await bcrypt.compare(password, passwordHash)}
        Permission denied: ${isPermission}
        Time restriction: ${difTime(
          user.starthour,
          user.startminute,
          user.finishhour,
          user.finishminute,
        )}`,
      )
    }

    const token = app.jwt.sign(user, { expiresIn: '8h' })

    reply.code(200).send({
      token,
      iduser: user.id,
      status: 200,
    })
  } catch (error) {
    reply.code(402).send({ status: 402, msg: `${error}` })
  }
}

// read permissions user
export const readPermissionUserIdHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const authorization = request.raw.headers.authorization

    if (!authorization) throw new Error('missing authorization header')

    const token = authorization.split(' ')[1]
    const decoded = app.jwt.decode(token) as Record<string, any>

    const { starthour, startminute, finishhour, finishminute } =
      readPermissionSchema.parse(decoded)

    const diftime: boolean = difTime(
      starthour,
      startminute,
      finishhour,
      finishminute,
    )

    if (diftime) throw new Error('time restriction')

    const now = new Date()
    const formatTime = (value?: string) =>
      value && value.length === 2 ? value : (`0${value ?? '0'}`).slice(-2)

    reply.code(200).send({
      status: 200,
      iduser: decoded.id,
      desuser: decoded.user ?? '',
      desname: decoded.name ?? '',
      desphone: decoded.phone ?? '',
      descor: decoded.color ?? '',
      avatar: decoded.avatar ?? 0,
      yearnow: now.getFullYear(),
      timenow: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      dateprevious: '',
      desip: request.ip ?? '',
      msgFooter: '',
      countAvatar: decoded.avatar ?? 0,
      startTime: `${formatTime(decoded.starthour)}:${formatTime(decoded.startminute)}`,
      finishTime: `${formatTime(decoded.finishhour)}:${formatTime(decoded.finishminute)}`,
      checklist: decoded.checklist ?? 0,
      produto: decoded.product ?? 0,
      occupationmap: decoded.occupationmap ?? 0,
      cliente: decoded.client ?? 0,
      cadusuario: decoded.caduser ?? 0,
      financeiro: decoded.financial ?? 0,
      billing: decoded.checklist ?? 0,
      cp: decoded.accountpay ?? 0,
      cr: decoded.accountreceive ?? 0,
      fornecedor: decoded.provider ?? 0,
      auditoria: decoded.audit ?? 0,
    })
  } catch (error) {
    reply.code(401).send({ msg: 'Sessão encerrada', error: `${error}` })
  }
}

// read users
export const readUsersHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
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
      starthour,
      startminute,
      finishhour,
      finishminute,
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
        starthour,
        startminute,
        finishhour,
        finishminute,
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
