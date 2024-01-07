import { z } from 'zod'

export const createSchema = z.object({
  user: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  password: z.string(),
  starttime: z.string().datetime(),
  finishtime: z.string().datetime(),
  sunday: z.boolean(),
  monday: z.boolean(),
  tuesday: z.boolean(),
  wednesday: z.boolean(),
  thursday: z.boolean(),
  friday: z.boolean(),
  saturday: z.boolean(),
  client: z.number().int(),
  caduser: z.number().int(),
  checklist: z.number().int(),
  provider: z.number().int(),
  audit: z.number().int(),
  accountpay: z.number().int(),
  accountreceive: z.number().int(),
  financial: z.number().int(),
  product: z.number().int(),
  occupationmap: z.number().int(),
  lastchange: z.string(),
  color: z.string(),
  avatar: z.number().int(),
})

export const readUniqueSchema = z.object({
  id: z.string(),
})

export const authenticateSchema = z.object({
  email: z.string(),
  password: z.string(),
})
