"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("dotenv/config");
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const users_1 = require("./routes/users");
const users_2 = require("./schemas/users");
const users_3 = require("./lib/users");
exports.app = (0, fastify_1.default)();
const url = process.env.URL_TEST;
const jwtsecret = process.env.JWT_SECRET;
const authUrl = {
    '/readusers': true,
    '/readuser/:id': true,
    '/updateuser/:id': true,
    '/createuser': true,
    '/readpermissionuser/:id': true,
    '/authenticate': false,
};
exports.app.register(cors_1.default, {
    origin: [`${url}`], // ambiente de teste e de produção
    allowedHeaders: ['Content-Type', 'Authorization'],
});
exports.app.register(users_1.userRoutes);
exports.app.register(jwt_1.default, {
    secret: jwtsecret,
});
exports.app.addHook('onRequest', async (req, reply) => {
    const path = req.routerPath || '';
    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (authUrl[path]) {
            const payload = await req.jwtVerify();
            const { starthour, startminute, finishhour, finishminute } = users_2.readPermissionSchema.parse(payload);
            const isTimeRestricted = (0, users_3.difTime)(starthour, startminute, finishhour, finishminute);
            if (isTimeRestricted) {
                return reply.code(403).send({ msg: 'Sessão encerrada', error: 'time restriction' });
            }
        }
    }
    catch (error) {
        return reply.code(403).send({ msg: 'Sessão encerrada', error });
    }
});
const PORT = process.env.NODE_DOCKER_PORT;
exports.app
    .listen({
    port: Number(PORT),
    host: '0.0.0.0',
})
    .then(() => {
    console.log(` Server started on port ${PORT}!`);
})
    .catch((e) => {
    console.log(`' Server stoped -> ${e}`);
});
