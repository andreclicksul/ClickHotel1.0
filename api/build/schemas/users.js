"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateSchema = exports.readUniqueSchema = exports.createSchema = exports.readPermissionSchema = void 0;
const zod_1 = require("zod");
const permissionLevelSchema = zod_1.z.number().int().min(0).max(4);
exports.readPermissionSchema = zod_1.z.object({
    id: zod_1.z.string(),
    user: zod_1.z.string(),
    starthour: zod_1.z.string(),
    startminute: zod_1.z.string(),
    finishhour: zod_1.z.string(),
    finishminute: zod_1.z.string(),
});
exports.createSchema = zod_1.z.object({
    user: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().trim().min(1).optional().or(zod_1.z.literal('')).or(zod_1.z.null()),
    password: zod_1.z.string().min(8),
    sunday: zod_1.z.boolean(),
    monday: zod_1.z.boolean(),
    tuesday: zod_1.z.boolean(),
    wednesday: zod_1.z.boolean(),
    thursday: zod_1.z.boolean(),
    friday: zod_1.z.boolean(),
    saturday: zod_1.z.boolean(),
    client: permissionLevelSchema,
    caduser: permissionLevelSchema,
    checklist: permissionLevelSchema,
    provider: permissionLevelSchema,
    audit: permissionLevelSchema,
    accountpay: permissionLevelSchema,
    accountreceive: permissionLevelSchema,
    financial: permissionLevelSchema,
    product: permissionLevelSchema,
    occupationmap: permissionLevelSchema,
    inactive: zod_1.z.boolean().optional().default(false),
    lastchange: zod_1.z.string().min(1),
    color: zod_1.z.string().min(1),
    avatar: zod_1.z.number().int().min(0),
    starthour: zod_1.z.string().min(1),
    startminute: zod_1.z.string().min(1),
    finishhour: zod_1.z.string().min(1),
    finishminute: zod_1.z.string().min(1),
});
exports.readUniqueSchema = zod_1.z.object({
    id: zod_1.z.string(),
});
exports.authenticateSchema = zod_1.z.object({
    email: zod_1.z.string(),
    password: zod_1.z.string(),
});
