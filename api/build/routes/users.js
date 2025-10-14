"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const users_1 = require("../services/users");
async function userRoutes(app) {
    // read users
    app.get('/readpermissionuser/:id', async (request, reply) => await (0, users_1.readPermissionUserIdHandler)(request, reply));
    app.get('/readusers', async (request, reply) => await (0, users_1.readUsersHandler)(request, reply));
    // read a user
    app.get('/readuser/:id', async (request, reply) => await (0, users_1.readUserIdHandler)(request, reply));
    // create user
    app.post('/createuser', async (request, reply) => await (0, users_1.createUserHandler)(request, reply));
    // update user
    app.put('/updateuser/:id', async (request, reply) => await (0, users_1.updateUserHandler)(request, reply));
    // Authenticate
    app.post('/authenticate', async (request, reply) => await (0, users_1.loginRouterHandler)(request, reply));
}
exports.userRoutes = userRoutes;
