"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserHandler = exports.readUserIdHandler = exports.readUsersHandler = exports.readPermissionUserIdHandler = exports.loginRouterHandler = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const bcrypt_1 = __importDefault(require("bcrypt"));
const server_1 = require("../server");
const prisma_1 = require("../lib/prisma");
const users_1 = require("../lib/users");
const users_2 = require("../schemas/users");
const user_services_1 = require("../middlewares/user.services");
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
        const authorization = request.raw.headers.authorization;
        if (!authorization)
            throw new Error('missing authorization header');
        const token = authorization.split(' ')[1];
        const decoded = server_1.app.jwt.decode(token);
        const { starthour, startminute, finishhour, finishminute } = users_2.readPermissionSchema.parse(decoded);
        const diftime = (0, users_1.difTime)(starthour, startminute, finishhour, finishminute);
        if (diftime)
            throw new Error('time restriction');
        const now = new Date();
        const formatTime = (value) => value && value.length === 2 ? value : (`0${value ?? '0'}`).slice(-2);
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
            cliente: decoded.client ?? 0,
            cadusuario: decoded.caduser ?? 0,
            financeiro: decoded.financial ?? 0,
            billing: decoded.checklist ?? 0,
            cp: decoded.accountpay ?? 0,
            cr: decoded.accountreceive ?? 0,
            fornecedor: decoded.provider ?? 0,
            auditoria: decoded.audit ?? 0,
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
        const users = await prisma_1.prisma.tb_users.findMany();
        reply.code(200).send({ msg: 'Usuário OK', data: users });
    }
    catch (error) {
        reply.code(401).send({ msg: 'Não há registros inseridos', error });
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
                dtregister: true,
                lastchange: true,
            },
            where: {
                id,
            },
        });
        reply.code(200).send({ msg: 'Usuário OK', data: user });
    }
    catch (error) {
        reply.code(401).send({ msg: 'Usuário não encontrado', error });
    }
};
exports.readUserIdHandler = readUserIdHandler;
// create user
const createUserHandler = async (request, reply) => {
    try {
        const { user, name, email, phone, password, sunday, monday, tuesday, wednesday, thursday, friday, saturday, client, caduser, checklist, provider, audit, accountpay, accountreceive, financial, product, occupationmap, lastchange, color, avatar, starthour, startminute, finishhour, finishminute, } = users_2.createSchema.parse(request.body);
        const salt = await bcrypt_1.default.genSalt(12);
        const passwordHash = await bcrypt_1.default.hash(password, salt);
        const createuser = await prisma_1.prisma.tb_users.create({
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
        });
        reply.code(200).send({ msg: 'Usuário OK', data: createuser });
        // return { status: 200, createuser, typeErr: 'OK' }
    }
    catch (error) {
        const typeErr = error.meta.target.toString();
        const textErr = typeErr === 'email' ? 'E-mail' : 'Usuário';
        reply.code(401).send({
            msg: `${textErr} já cadastrado`,
            error,
        });
        // return { status: 401, error, typeErr: textErr }
    }
};
exports.createUserHandler = createUserHandler;
