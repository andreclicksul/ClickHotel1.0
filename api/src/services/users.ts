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

const resolveUniqueConstraintMessage = (
  error: PrismaClientKnownRequestError,
) => {
  const target = Array.isArray(error.meta?.target)
    ? error.meta?.target?.[0]
    : error.meta?.target

  const field =
    typeof target === 'string' && target.toLowerCase().includes('email')
      ? 'E-mail'
      : 'Usuário'

  return `${field} já cadastrado.`
}

const AUDIT_FIELDS: Array<{ key: string; label: string }> = [
  { key: 'user', label: 'USUARIO' },
  { key: 'name', label: 'NOME' },
  { key: 'email', label: 'EMAIL' },
  { key: 'phone', label: 'PHONE' },
  { key: 'sunday', label: 'DOMINGO' },
  { key: 'monday', label: 'SEGUNDA' },
  { key: 'tuesday', label: 'TERCA' },
  { key: 'wednesday', label: 'QUARTA' },
  { key: 'thursday', label: 'QUINTA' },
  { key: 'friday', label: 'SEXTA' },
  { key: 'saturday', label: 'SABADO' },
  { key: 'client', label: 'CLIENTE' },
  { key: 'caduser', label: 'CADUSUARIO' },
  { key: 'checklist', label: 'CHECKLIST' },
  { key: 'provider', label: 'FORNECEDOR' },
  { key: 'audit', label: 'AUDITORIA' },
  { key: 'accountpay', label: 'CONTA_PAGAR' },
  { key: 'accountreceive', label: 'CONTA_RECEBER' },
  { key: 'financial', label: 'FINANCEIRO' },
  { key: 'product', label: 'PRODUTO' },
  { key: 'occupationmap', label: 'MAPA_OCUPACAO' },
  { key: 'inactive', label: 'INATIVO' },
  { key: 'color', label: 'COR' },
  { key: 'avatar', label: 'AVATAR' },
  { key: 'starthour', label: 'HORARIO_INICIO' },
  { key: 'startminute', label: 'MINUTO_INICIO' },
  { key: 'finishhour', label: 'HORARIO_FIM' },
  { key: 'finishminute', label: 'MINUTO_FIM' },
]

const formatAuditValue = (value: unknown) => {
  if (typeof value === 'string') {
    return value.toUpperCase()
  }

  if (typeof value === 'boolean') {
    return value ? 'TRUE' : 'FALSE'
  }

  if (value === null || value === undefined) {
    return ''
  }

  return String(value).toUpperCase()
}

const buildUserAuditString = (user: Record<string, any>) => {
  const result = AUDIT_FIELDS.map(({ key, label }) => {
    const value = user?.[key as keyof typeof user]
    return `${label}:${formatAuditValue(value)}`
  }).join(',')

  return `${result},`
}

const buildUserAuditDiff = (
  before: Record<string, any>,
  after: Record<string, any>,
) => {
  const changedFields = AUDIT_FIELDS.filter(({ key }) => {
    const beforeVal = before?.[key as keyof typeof before]
    const afterVal = after?.[key as keyof typeof after]
    return beforeVal !== afterVal
  })

  if (!changedFields.length) {
    return { before: null, after: null }
  }

  const beforeEntries = changedFields
    .map(({ key, label }) => `${label}:${formatAuditValue(before?.[key as keyof typeof before])}`)
    .join(',')
  const afterEntries = changedFields
    .map(({ key, label }) => `${label}:${formatAuditValue(after?.[key as keyof typeof after])}`)
    .join(',')

  return {
    before: `${beforeEntries},`,
    after: `${afterEntries},`,
  }
}

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

    const parsed = updateSchema.parse(request.body)

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
      inactive,
      lastchange,
      color,
      avatar,
      starthour,
      startminute,
      finishhour,
      finishminute,
    } = parsed

    const normalizedPhone =
      typeof phone === 'string' ? phone.trim() : ''

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password ?? '', salt)

    const existingUser = await prisma.tb_users.findFirst({
      where: {
        OR: [{ user }, { email }],
      },
    })

    if (existingUser && !existingUser.deleted) {
      return reply.code(409).send({
        status: 409,
        msg:
          existingUser.user === user
            ? 'Usuário já cadastrado.'
            : 'E-mail já cadastrado.',
      })
    }

    let createdUser

    if (existingUser && existingUser.deleted) {
      createdUser = await prisma.tb_users.update({
        where: { id: existingUser.id },
        data: {
          user,
          name,
          email,
          phone: normalizedPhone !== '' ? normalizedPhone : null,
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
          inactive: inactive ?? false,
          lastchange,
          color,
          avatar,
          starthour,
          startminute,
          finishhour,
          finishminute,
          deleted: false,
        },
      })
    } else {
      createdUser = await prisma.tb_users.create({
        data: {
          user,
          name,
          email,
          phone: normalizedPhone !== '' ? normalizedPhone : null,
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
          inactive: inactive ?? false,
          lastchange,
          color,
          avatar,
          starthour,
          startminute,
          finishhour,
          finishminute,
        },
      })
    }

    const { password: _password, ...safeUser } = createdUser

    try {
      await prisma.tb_audit.create({
        data: {
          typemodule: 'INS',
          module: 'USUARIO',
          beforeinf:
            existingUser && existingUser.deleted
              ? buildUserAuditString(existingUser)
              : null,
          currentinf: buildUserAuditString(safeUser),
          ipaccess: request.ip ?? '',
          iduser: String(payload.id ?? ''),
        },
      })
    } catch (auditError) {
      // audit failures must not block user creation
    }

    reply.code(201).send({ status: 201, msg: 'Usuário criado com sucesso.', data: safeUser })
    // return { status: 200, createuser, typeErr: 'OK' }
  } catch (error: any) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return reply.code(409).send({
        status: 409,
        msg: resolveUniqueConstraintMessage(error),
      })
    }

    if (error instanceof ZodError) {
      return reply.code(400).send({
        status: 400,
        msg: 'Usuário já existente.',
        issues: error.issues,
      })
    }

    reply.code(500).send({
      status: 500,
      msg: 'Erro ao criar usuário.',
      error: `${error}`,
    })
    // return { status: 401, error, typeErr: textErr }
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
      where: { id },
    })

    if (!existingUser || existingUser.deleted) {
      return reply
        .code(404)
        .send({ status: 404, msg: 'Usuário não encontrado para atualização.' })
    }

    const parsed = updateSchema.parse(request.body)

    const normalizedPhone =
      typeof parsed.phone === 'string'
        ? parsed.phone.trim()
        : existingUser.phone ?? ''

    let passwordHash: string | undefined

    if (typeof parsed.password === 'string' && parsed.password.trim() !== '') {
      const salt = await bcrypt.genSalt(12)
      passwordHash = await bcrypt.hash(parsed.password, salt)
    }

    const updatedUser = await prisma.tb_users.update({
      where: { id },
      data: {
        user: parsed.user ?? existingUser.user,
        name: parsed.name ?? existingUser.name,
        email: parsed.email ?? existingUser.email,
        phone: normalizedPhone !== '' ? normalizedPhone : null,
        ...(passwordHash ? { password: passwordHash } : {}),
        sunday: parsed.sunday ?? existingUser.sunday,
        monday: parsed.monday ?? existingUser.monday,
        tuesday: parsed.tuesday ?? existingUser.tuesday,
        wednesday: parsed.wednesday ?? existingUser.wednesday,
        thursday: parsed.thursday ?? existingUser.thursday,
        friday: parsed.friday ?? existingUser.friday,
        saturday: parsed.saturday ?? existingUser.saturday,
        client: parsed.client ?? existingUser.client,
        caduser: parsed.caduser ?? existingUser.caduser,
        checklist: parsed.checklist ?? existingUser.checklist,
        provider: parsed.provider ?? existingUser.provider,
        audit: parsed.audit ?? existingUser.audit,
        accountpay: parsed.accountpay ?? existingUser.accountpay,
        accountreceive: parsed.accountreceive ?? existingUser.accountreceive,
        financial: parsed.financial ?? existingUser.financial,
        product: parsed.product ?? existingUser.product,
        occupationmap: parsed.occupationmap ?? existingUser.occupationmap,
        inactive:
          typeof parsed.inactive === 'boolean'
            ? parsed.inactive
            : existingUser.inactive,
        lastchange: parsed.lastchange ?? existingUser.lastchange,
        color: parsed.color ?? existingUser.color,
        avatar: parsed.avatar ?? existingUser.avatar,
        starthour: parsed.starthour ?? existingUser.starthour,
        startminute: parsed.startminute ?? existingUser.startminute,
        finishhour: parsed.finishhour ?? existingUser.finishhour,
        finishminute: parsed.finishminute ?? existingUser.finishminute,
      },
    })

    const { password: _password, ...safeUser } = updatedUser

    reply
      .code(200)
      .send({ status: 200, msg: 'Usuário atualizado com sucesso.', data: safeUser })

    const diff = buildUserAuditDiff(existingUser, safeUser)

    if (diff.before && diff.after) {
      try {
        await prisma.tb_audit.create({
          data: {
            typemodule: 'ALT',
            module: 'USUARIO',
            beforeinf: diff.before,
            currentinf: diff.after,
            ipaccess: request.ip ?? '',
            iduser: String(payload.id ?? ''),
          },
        })
      } catch (auditError) {
        // ignore audit failure on update
      }
    }
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return reply.code(409).send({
          status: 409,
          msg: resolveUniqueConstraintMessage(error),
        })
      }

      if (error.code === 'P2025') {
        return reply
          .code(404)
          .send({ status: 404, msg: 'Usuário não encontrado para atualização.' })
      }
    }

    if (error instanceof ZodError) {
      return reply.code(400).send({
        status: 400,
        msg: 'Usuário já existente.',
        issues: error.issues,
      })
    }

    reply.code(500).send({
      status: 500,
      msg: 'Erro ao atualizar usuário.',
      error: `${error}`,
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
      where: { id },
    })

    if (!existingUser || existingUser.deleted) {
      return reply
        .code(404)
        .send({ status: 404, msg: 'Usuário não encontrado para exclusão.' })
    }

    const beforeInfo = buildUserAuditString(existingUser)

    const deletedUser = await prisma.tb_users.update({
      where: { id },
      data: {
        deleted: true,
        inactive: true,
      },
    })

    const { password: _password, ...safeUser } = deletedUser

    reply
      .code(200)
      .send({ status: 200, msg: 'Usuário excluído com sucesso.', data: safeUser })

    try {
      await prisma.tb_audit.create({
        data: {
          typemodule: 'DEL',
          module: 'USUARIO',
          beforeinf: beforeInfo,
          currentinf: '',
          ipaccess: request.ip ?? '',
          iduser: String(payload.id ?? ''),
        },
      })
    } catch (auditError) {
      // ignore audit failure
    }
  } catch (error: any) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return reply
        .code(404)
        .send({ status: 404, msg: 'Usuário não encontrado para exclusão.' })
    }

    reply.code(500).send({
      status: 500,
      msg: 'Erro ao excluir usuário.',
      error: `${error}`,
    })
  }
}
