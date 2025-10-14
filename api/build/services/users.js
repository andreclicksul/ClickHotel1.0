"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserHandler = exports.createUserHandler = exports.readUserIdHandler = exports.readUsersHandler = exports.readPermissionUserIdHandler = exports.loginRouterHandler = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const server_1 = require("../server");
const prisma_1 = require("../lib/prisma");
const users_1 = require("../lib/users");
const users_2 = require("../schemas/users");
const user_services_1 = require("../middlewares/user.services");
const resolveUniqueConstraintMessage = (error) => {
    const target = Array.isArray(error.meta?.target)
        ? error.meta?.target?.[0]
        : error.meta?.target;
    const field = typeof target === 'string' && target.toLowerCase().includes('email')
        ? 'E-mail'
        : 'Usuário';
    return `${field} já cadastrado.`;
};
const loginRouterHandler = async (request, reply) => {
    try {
        const { email, password } = users_2.authenticateSchema.parse(request.body);
        const registerUser = await prisma_1.prisma.tb_users.findFirst({
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
        });
        if (!registerUser)
            throw new Error('erro1');
        const objectUser = registerUser;
        const { user, isPermission, passwordHash } = await (0, user_services_1.findUserAuthentication)(objectUser);
        if (!(await bcrypt_1.default.compare(password, passwordHash)) ||
            !isPermission ||
            (0, users_1.difTime)(user.starthour, user.startminute, user.finishhour, user.finishminute)) {
            throw new Error(`Authentication failed. 
        Password is incorrect: ${await bcrypt_1.default.compare(password, passwordHash)}
        Permission denied: ${isPermission}
        Time restriction: ${(0, users_1.difTime)(user.starthour, user.startminute, user.finishhour, user.finishminute)}`);
        }
        const token = server_1.app.jwt.sign(user, { expiresIn: '8h' });
        reply.code(200).send({
            token,
            iduser: user.id,
            status: 200,
        });
    }
    catch (error) {
        reply.code(402).send({ status: 402, msg: `${error}` });
    }
};
exports.loginRouterHandler = loginRouterHandler;
// read permissions user
const readPermissionUserIdHandler = async (request, reply) => {
    try {
        const payload = (request.user ?? (await request.jwtVerify()));
        const { starthour, startminute, finishhour, finishminute } = users_2.readPermissionSchema.parse(payload);
        const diftime = (0, users_1.difTime)(starthour, startminute, finishhour, finishminute);
        if (diftime)
            throw new Error('time restriction');
        const now = new Date();
        const formatTime = (value) => value && value.length === 2 ? value : (`0${value ?? '0'}`).slice(-2);
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
        });
    }
    catch (error) {
        reply.code(401).send({ msg: 'Sessão encerrada', error: `${error}` });
    }
};
exports.readPermissionUserIdHandler = readPermissionUserIdHandler;
// read users
const readUsersHandler = async (request, reply) => {
    try {
        const users = await prisma_1.prisma.tb_users.findMany({
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
        });
        reply.code(200).send({
            status: 200,
            users,
        });
    }
    catch (error) {
        reply.code(401).send({ status: 401, msg: 'Não há registros inseridos', error });
    }
};
exports.readUsersHandler = readUsersHandler;
// read a user
const readUserIdHandler = async (request, reply) => {
    try {
        const { id } = users_2.readUniqueSchema.parse(request.params);
        const user = await prisma_1.prisma.tb_users.findUniqueOrThrow({
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
        });
        reply.code(200).send({ status: 200, msg: 'Usuário OK', data: user });
    }
    catch (error) {
        reply.code(404).send({ status: 404, msg: 'Usuário não encontrado', error });
    }
};
exports.readUserIdHandler = readUserIdHandler;
// create user
const createUserHandler = async (request, reply) => {
    try {
        const payload = (request.user ?? (await request.jwtVerify()));
        const caduserPermission = Number(payload?.caduser ?? 0);
        if (caduserPermission < 2) {
            return reply
                .code(403)
                .send({ status: 403, msg: 'Permissão insuficiente para criar usuários.' });
        }
        const parsed = users_2.createSchema.parse(request.body);
        const { user, name, email, phone, password, sunday, monday, tuesday, wednesday, thursday, friday, saturday, client, caduser, checklist, provider, audit, accountpay, accountreceive, financial, product, occupationmap, inactive, lastchange, color, avatar, starthour, startminute, finishhour, finishminute, } = parsed;
        const normalizedPhone = typeof phone === 'string' ? phone.trim() : '';
        const salt = await bcrypt_1.default.genSalt(12);
        const passwordHash = await bcrypt_1.default.hash(password, salt);
        const createuser = await prisma_1.prisma.tb_users.create({
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
        });
        const { password: _password, ...safeUser } = createuser;
        reply.code(201).send({ status: 201, msg: 'Usuário criado com sucesso.', data: safeUser });
        // return { status: 200, createuser, typeErr: 'OK' }
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return reply.code(400).send({
                status: 400,
                msg: 'Dados inválidos.',
                issues: error.issues,
            });
        }
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002') {
            return reply.code(409).send({
                status: 409,
                msg: resolveUniqueConstraintMessage(error),
            });
        }
        reply.code(500).send({
            status: 500,
            msg: 'Erro ao criar usuário.',
            error: `${error}`,
        });
        // return { status: 401, error, typeErr: textErr }
    }
};
exports.createUserHandler = createUserHandler;
// update user
const updateUserHandler = async (request, reply) => {
    try {
        const { id } = users_2.readUniqueSchema.parse(request.params);
        const payload = (request.user ?? (await request.jwtVerify()));
        const caduserPermission = Number(payload?.caduser ?? 0);
        if (caduserPermission < 3) {
            return reply
                .code(403)
                .send({ status: 403, msg: 'Permissão insuficiente para editar usuários.' });
        }
        const parsed = users_2.createSchema.parse(request.body);
        const { user, name, email, phone, password, sunday, monday, tuesday, wednesday, thursday, friday, saturday, client, caduser, checklist, provider, audit, accountpay, accountreceive, financial, product, occupationmap, inactive, lastchange, color, avatar, starthour, startminute, finishhour, finishminute, } = parsed;
        const normalizedPhone = typeof phone === 'string' ? phone.trim() : '';
        const salt = await bcrypt_1.default.genSalt(12);
        const passwordHash = await bcrypt_1.default.hash(password, salt);
        const updatedUser = await prisma_1.prisma.tb_users.update({
            where: { id },
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
        });
        const { password: _password, ...safeUser } = updatedUser;
        reply
            .code(200)
            .send({ status: 200, msg: 'Usuário atualizado com sucesso.', data: safeUser });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return reply.code(400).send({
                status: 400,
                msg: 'Dados inválidos.',
                issues: error.issues,
            });
        }
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return reply.code(409).send({
                    status: 409,
                    msg: resolveUniqueConstraintMessage(error),
                });
            }
            if (error.code === 'P2025') {
                return reply
                    .code(404)
                    .send({ status: 404, msg: 'Usuário não encontrado para atualização.' });
            }
        }
        reply.code(500).send({
            status: 500,
            msg: 'Erro ao atualizar usuário.',
            error: `${error}`,
        });
    }
};
exports.updateUserHandler = updateUserHandler;
