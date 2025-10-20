/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt'
import { FastifyRequest, FastifyReply } from 'fastify'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { ZodError } from 'zod'
import { app } from '../server'
import { prisma } from '../lib/prisma'
import { difTime } from '../lib/users'
import {
  createSchema,
  authenticateSchema,
  readUniqueSchema,
  readPermissionSchema,
  updateSchema,
} from '../schemas/users'
import { findUserAuthentication } from '../middlewares/user.services'

const userSelect = {
  id: true,
  user: true,
  name: true,
  email: true,
  phone: true,
  sunday: true,
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: true,
  client: true,
  caduser: true,
  checklist: true,
  provider: true,
  audit: true,
  accountpay: true,
  accountreceive: true,
  financial: true,
  product: true,
  occupationmap: true,
  inactive: true,
  lastchange: true,
  color: true,
  avatar: true,
  starthour: true,
  startminute: true,
  finishhour: true,
  finishminute: true,
  deleted: true,
} as const


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
    const payload = (
      (request as any).user ?? (await request.jwtVerify())
    ) as Record<string, any>

    const { starthour, startminute, finishhour, finishminute } =
      readPermissionSchema.parse(payload)

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
      iduser: payload.id,
      desuser: payload.user ?? '',
      desname: payload.name ?? '',
      desphone: payload.phone ?? '',
      descor: payload.color ?? '',
      avatar: payload.avatar ?? 0,
      yearnow: now.getFullYear(),
      timenow: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      dateprevious: '',
      desip: request.ip ?? '',
      msgFooter: '',
      countAvatar: payload.avatar ?? 0,
      startTime: `${formatTime(payload.starthour)}:${formatTime(payload.startminute)}`,
      finishTime: `${formatTime(payload.finishhour)}:${formatTime(payload.finishminute)}`,
      checklist: payload.checklist ?? 0,
      produto: payload.product ?? 0,
      occupationmap: payload.occupationmap ?? 0,
      cliente: payload.client ?? 0,
      cadusuario: payload.caduser ?? 0,
      financeiro: payload.financial ?? 0,
      billing: payload.checklist ?? 0,
      cp: payload.accountpay ?? 0,
      cr: payload.accountreceive ?? 0,
      fornecedor: payload.provider ?? 0,
      auditoria: payload.audit ?? 0,
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
    const users = await prisma.tb_users.findMany({
      where: {
        deleted: false,
      },
      select: {
        id: true,
        user: true,
        name: true,
        phone: true,
        email: true,
        inactive: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    reply.code(200).send({
      status: 200,
      users,
    })
  } catch (error) {
    reply.code(401).send({ status: 401, msg: 'Não há registros inseridos', error })
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
        phone: true,
        sunday: true,
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        client: true,
        caduser: true,
        checklist: true,
        provider: true,
        audit: true,
        accountpay: true,
        accountreceive: true,
        financial: true,
        product: true,
        occupationmap: true,
        inactive: true,
        color: true,
        avatar: true,
        starthour: true,
        startminute: true,
        finishhour: true,
        finishminute: true,
        dtregister: true,
        lastchange: true,
      },
      where: {
        id,
      },
    })
    reply.code(200).send({ status: 200, msg: 'Usuário OK', data: user })
  } catch (error) {
    reply.code(404).send({ status: 404, msg: 'Usuário não encontrado', error })
  }
}

// create user
export const createUserHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const payload = (
      (request as any).user ?? (await request.jwtVerify())
    ) as Record<string, any>

    const caduserPermission = Number(payload?.caduser ?? 0)

    if (caduserPermission < 2) {
      return reply
        .code(403)
        .send({ status: 403, msg: 'Permissão insuficiente para criar usuários.' })
    }

    const parsed = createSchema.parse(request.body)

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(parsed.password ?? '', salt)

    const spResult = await prisma.$queryRaw<
      { sp_manage_user: string }[]
    >`
      SELECT public.sp_manage_user(
        ${'INS'}::text,
        ${null}::uuid,
        ${parsed.user}::text,
        ${parsed.name}::text,
        ${parsed.email}::text,
        ${parsed.phone}::text,
        ${passwordHash}::text,
        ${parsed.sunday}::boolean,
        ${parsed.monday}::boolean,
        ${parsed.tuesday}::boolean,
        ${parsed.wednesday}::boolean,
        ${parsed.thursday}::boolean,
        ${parsed.friday}::boolean,
        ${parsed.saturday}::boolean,
        ${parsed.client}::int,
        ${parsed.caduser}::int,
        ${parsed.checklist}::int,
        ${parsed.provider}::int,
        ${parsed.audit}::int,
        ${parsed.accountpay}::int,
        ${parsed.accountreceive}::int,
        ${parsed.financial}::int,
        ${parsed.product}::int,
        ${parsed.occupationmap}::int,
        ${parsed.inactive}::boolean,
        ${parsed.lastchange}::text,
        ${parsed.color}::text,
        ${parsed.avatar}::int,
        ${parsed.starthour}::text,
        ${parsed.startminute}::text,
        ${parsed.finishhour}::text,
        ${parsed.finishminute}::text,
        ${request.ip ?? null}::text,
        ${payload.id ?? null}::uuid
      )
    `

    const newUserId = spResult?.[0]?.sp_manage_user

    if (!newUserId) {
      throw new Error('Falha ao criar usuário.')
    }

    const createdUser = await prisma.tb_users.findUnique({
      select: userSelect,
      where: { id: newUserId },
    })

    if (!createdUser) {
      throw new Error('Usuário criado não localizado.')
    }

    reply
      .code(201)
      .send({ status: 201, msg: 'Usuário criado com sucesso.', data: createdUser })
  } catch (error: any) {
    if (error instanceof ZodError) {
      return reply.code(400).send({
        status: 400,
        msg: 'Usuário já existente.',
        issues: error.issues,
      })
    }

    let cause = ''

    if (error instanceof PrismaClientKnownRequestError) {
      cause = String(error.meta?.cause ?? error.message ?? '')
    } else if (error instanceof Error) {
      cause = error.message
    } else {
      cause = String(error)
    }

    if (
      error instanceof PrismaClientKnownRequestError &&
      cause.includes('Usuário ou e-mail já cadastrado')
    ) {
      return reply.code(409).send({ status: 409, msg: 'Usuário já existente.' })
    }

    if (
      error instanceof PrismaClientKnownRequestError &&
      cause.toLowerCase().includes('already exists')
    ) {
      return reply.code(409).send({ status: 409, msg: 'Usuário já existente.' })
    }

    if (
      error instanceof PrismaClientKnownRequestError &&
      cause.toLowerCase().includes('usuário não encontrado')
    ) {
      return reply.code(404).send({ status: 404, msg: 'Usuário não encontrado.' })
    }

    console.error('createUserHandler error:', error)

    reply.code(500).send({
      status: 500,
      msg: 'Erro ao criar usuário.',
      error: cause || `${error}`,
    })
  }
}

// update user
export const updateUserHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { id } = readUniqueSchema.parse(request.params)

    const payload = (
      (request as any).user ?? (await request.jwtVerify())
    ) as Record<string, any>

    const caduserPermission = Number(payload?.caduser ?? 0)

    if (caduserPermission < 3) {
      return reply
        .code(403)
        .send({ status: 403, msg: 'Permissão insuficiente para editar usuários.' })
    }

    const existingUser = await prisma.tb_users.findUnique({
      select: userSelect,
      where: { id },
    })

    if (!existingUser || existingUser.deleted) {
      return reply
        .code(404)
        .send({ status: 404, msg: 'Usuário não encontrado para atualização.' })
    }

    const parsed = updateSchema.parse(request.body)

    const passwordHash =
      typeof parsed.password === 'string' && parsed.password.trim() !== ''
        ? await bcrypt.hash(parsed.password, await bcrypt.genSalt(12))
        : null

    await prisma.$queryRaw`
      SELECT public.sp_manage_user(
        ${'ALT'}::text,
        ${id}::uuid,
        ${parsed.user ?? null}::text,
        ${parsed.name ?? null}::text,
        ${parsed.email ?? null}::text,
        ${parsed.phone ?? null}::text,
        ${passwordHash}::text,
        ${parsed.sunday ?? null}::boolean,
        ${parsed.monday ?? null}::boolean,
        ${parsed.tuesday ?? null}::boolean,
        ${parsed.wednesday ?? null}::boolean,
        ${parsed.thursday ?? null}::boolean,
        ${parsed.friday ?? null}::boolean,
        ${parsed.saturday ?? null}::boolean,
        ${parsed.client ?? null}::int,
        ${parsed.caduser ?? null}::int,
        ${parsed.checklist ?? null}::int,
        ${parsed.provider ?? null}::int,
        ${parsed.audit ?? null}::int,
        ${parsed.accountpay ?? null}::int,
        ${parsed.accountreceive ?? null}::int,
        ${parsed.financial ?? null}::int,
        ${parsed.product ?? null}::int,
        ${parsed.occupationmap ?? null}::int,
        ${parsed.inactive ?? null}::boolean,
        ${parsed.lastchange ?? null}::text,
        ${parsed.color ?? null}::text,
        ${parsed.avatar ?? null}::int,
        ${parsed.starthour ?? null}::text,
        ${parsed.startminute ?? null}::text,
        ${parsed.finishhour ?? null}::text,
        ${parsed.finishminute ?? null}::text,
        ${request.ip ?? null}::text,
        ${payload.id ?? null}::uuid
      )
    `

    const updatedUser = await prisma.tb_users.findUnique({
      select: userSelect,
      where: { id },
    })

    if (!updatedUser) {
      return reply
        .code(404)
        .send({ status: 404, msg: 'Usuário não encontrado para atualização.' })
    }

    reply
      .code(200)
      .send({ status: 200, msg: 'Usuário atualizado com sucesso.', data: updatedUser })
  } catch (error: any) {
    if (error instanceof ZodError) {
      return reply.code(400).send({
        status: 400,
        msg: 'Usuário já existente.',
        issues: error.issues,
      })
    }

    let cause = ''

    if (error instanceof PrismaClientKnownRequestError) {
      cause = String(error.meta?.cause ?? error.message ?? '')
    } else if (error instanceof Error) {
      cause = error.message
    } else {
      cause = String(error)
    }

    if (
      error instanceof PrismaClientKnownRequestError &&
      cause.includes('Usuário ou e-mail já cadastrado')
    ) {
      return reply.code(409).send({ status: 409, msg: 'Usuário já existente.' })
    }

    if (
      error instanceof PrismaClientKnownRequestError &&
      cause.toLowerCase().includes('already exists')
    ) {
      return reply.code(409).send({ status: 409, msg: 'Usuário já existente.' })
    }

    if (
      error instanceof PrismaClientKnownRequestError &&
      cause.toLowerCase().includes('usuário não encontrado')
    ) {
      return reply
        .code(404)
        .send({ status: 404, msg: 'Usuário não encontrado para atualização.' })
    }

    if (
      error instanceof Error &&
      (
        cause.toLowerCase().includes('usuário ou e-mail já cadastrado') ||
        cause.toLowerCase().includes('already exists')
      )
    ) {
      return reply.code(409).send({ status: 409, msg: 'Usuário já existente.' })
    }

    console.error('updateUserHandler error:', error)

    reply.code(500).send({
      status: 500,
      msg: 'Erro ao atualizar usuário.',
      error: cause || `${error}`,
    })
  }
}

export const deleteUserHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { id } = readUniqueSchema.parse(request.params)

    const payload = (
      (request as any).user ?? (await request.jwtVerify())
    ) as Record<string, any>

    const caduserPermission = Number(payload?.caduser ?? 0)

    if (caduserPermission < 3) {
      return reply
        .code(403)
        .send({ status: 403, msg: 'Permissão insuficiente para excluir usuários.' })
    }

    const existingUser = await prisma.tb_users.findUnique({
      select: userSelect,
      where: { id },
    })

    if (!existingUser || existingUser.deleted) {
      return reply
        .code(404)
        .send({ status: 404, msg: 'Usuário não encontrado para exclusão.' })
    }

    await prisma.$queryRaw`
      SELECT public.sp_manage_user(
        ${'DEL'}::text,
        ${id}::uuid,
        ${null}::text, ${null}::text, ${null}::text, ${null}::text, ${null}::text,
        ${null}::boolean, ${null}::boolean, ${null}::boolean, ${null}::boolean, ${null}::boolean, ${null}::boolean, ${null}::boolean,
        ${null}::int, ${null}::int, ${null}::int, ${null}::int, ${null}::int, ${null}::int, ${null}::int,
        ${null}::int, ${null}::int, ${null}::int,
        ${null}::boolean, ${null}::text, ${null}::text, ${null}::int,
        ${null}::text, ${null}::text, ${null}::text, ${null}::text,
        ${request.ip ?? null}::text,
        ${payload.id ?? null}::uuid
      )
    `

    const deletedUser = await prisma.tb_users.findUnique({
      select: userSelect,
      where: { id },
    })

    reply
      .code(200)
      .send({ status: 200, msg: 'Usuário excluído com sucesso.', data: deletedUser })
  } catch (error: any) {
    const cause =
      error instanceof PrismaClientKnownRequestError
        ? String(error.meta?.cause ?? error.message ?? '')
        : error instanceof Error
        ? error.message
        : String(error)

    if (
      error instanceof PrismaClientKnownRequestError &&
      cause.toLowerCase().includes('usuário não encontrado')
    ) {
      return reply
        .code(404)
        .send({ status: 404, msg: 'Usuário não encontrado para exclusão.' })
    }

    console.error('deleteUserHandler error:', error)

    reply.code(500).send({
      status: 500,
      msg: 'Erro ao excluir usuário.',
      error: cause,
    })
  }
}
