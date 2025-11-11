import { z } from 'zod'

const permissionLevelSchema = z.number().int().min(0).max(4)

export const readPermissionSchema = z.object({
  id: z.string(),
  user: z.string(),
  starthour: z.string(),
  startminute: z.string(),
  finishhour: z.string(),
  finishminute: z.string(),
})

export const createSchema = z.object({
  user: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().trim().min(1).optional().or(z.literal('')).or(z.null()),
  password: z.string().min(8),
  sunday: z.boolean(),
  monday: z.boolean(),
  tuesday: z.boolean(),
  wednesday: z.boolean(),
  thursday: z.boolean(),
  friday: z.boolean(),
  saturday: z.boolean(),
  client: permissionLevelSchema,
  caduser: permissionLevelSchema,
  checklist: permissionLevelSchema,
  provider: permissionLevelSchema,
  uh: permissionLevelSchema,
  audit: permissionLevelSchema,
  accountpay: permissionLevelSchema,
  accountreceive: permissionLevelSchema,
  cashflow: permissionLevelSchema,
  financial: permissionLevelSchema,
  product: permissionLevelSchema,
  occupationmap: permissionLevelSchema,
  restaurant: permissionLevelSchema,
  inactive: z.boolean().optional().default(false),
  lastchange: z.string().min(1),
  color: z.string().min(1),
  avatar: z.number().int().min(0),
  starthour: z.string().min(1),
  startminute: z.string().min(1),
  finishhour: z.string().min(1),
  finishminute: z.string().min(1),
})

export const updateSchema = createSchema.partial().extend({
  password: createSchema.shape.password.optional(),
})

export const readUniqueSchema = z.object({
  id: z.string(),
})

export const authenticateSchema = z.object({
  email: z.string(),
  password: z.string(),
})
