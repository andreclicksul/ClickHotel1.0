import { prisma } from '../lib/prisma'

export const USER_AUDIT_FIELDS: Array<{ key: string; label: string }> = [
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

export type AuditFieldConfig = typeof USER_AUDIT_FIELDS

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

export const buildAuditString = (
  data: Record<string, any>,
  fields: AuditFieldConfig,
) => {
  const result = fields
    .map(({ key, label }) => `${label}:${formatAuditValue(data?.[key])}`)
    .join(',')

  return `${result},`
}

export const buildAuditDiff = (
  before: Record<string, any>,
  after: Record<string, any>,
  fields: AuditFieldConfig,
) => {
  const changedFields = fields.filter(({ key }) => before?.[key] !== after?.[key])

  if (!changedFields.length) {
    return { before: null, after: null }
  }

  const beforeEntries = changedFields
    .map(({ key, label }) => `${label}:${formatAuditValue(before?.[key])}`)
    .join(',')

  const afterEntries = changedFields
    .map(({ key, label }) => `${label}:${formatAuditValue(after?.[key])}`)
    .join(',')

  return {
    before: `${beforeEntries},`,
    after: `${afterEntries},`,
  }
}

export type AuditPayload = {
  typemodule: string
  module: string
  beforeinf: string | null
  currentinf: string | null
  ipaccess?: string
  iduser?: string
}

export const registerAudit = async (payload: AuditPayload) => {
  await prisma.tb_audit.create({
    data: {
      typemodule: payload.typemodule,
      module: payload.module,
      beforeinf: payload.beforeinf,
      currentinf: payload.currentinf,
      ipaccess: payload.ipaccess ?? '',
      iduser: payload.iduser ?? '',
    },
  })
}
