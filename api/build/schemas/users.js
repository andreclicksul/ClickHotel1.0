"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateSchema = exports.readUniqueSchema = exports.createSchema = exports.readPermissionSchema = void 0;
const zod_1 = require("zod");
exports.readPermissionSchema = zod_1.z.object({
    id: zod_1.z.string(),
    user: zod_1.z.string(),
    starthour: zod_1.z.string(),
    startminute: zod_1.z.string(),
    finishhour: zod_1.z.string(),
    finishminute: zod_1.z.string(),
});
exports.createSchema = zod_1.z.object({
    user: zod_1.z.string(),
    name: zod_1.z.string(),
    email: zod_1.z.string(),
    phone: zod_1.z.string(),
    password: zod_1.z.string(),
    sunday: zod_1.z.boolean(),
    monday: zod_1.z.boolean(),
    tuesday: zod_1.z.boolean(),
    wednesday: zod_1.z.boolean(),
    thursday: zod_1.z.boolean(),
    friday: zod_1.z.boolean(),
    saturday: zod_1.z.boolean(),
    client: zod_1.z.number().int(),
    caduser: zod_1.z.number().int(),
    checklist: zod_1.z.number().int(),
    provider: zod_1.z.number().int(),
    audit: zod_1.z.number().int(),
    accountpay: zod_1.z.number().int(),
    accountreceive: zod_1.z.number().int(),
    financial: zod_1.z.number().int(),
    product: zod_1.z.number().int(),
    occupationmap: zod_1.z.number().int(),
    lastchange: zod_1.z.string(),
    color: zod_1.z.string(),
    avatar: zod_1.z.number().int(),
    starthour: zod_1.z.string(),
    startminute: zod_1.z.string(),
    finishhour: zod_1.z.string(),
    finishminute: zod_1.z.string(),
});
exports.readUniqueSchema = zod_1.z.object({
    id: zod_1.z.string(),
});
exports.authenticateSchema = zod_1.z.object({
    email: zod_1.z.string(),
    password: zod_1.z.string(),
});
