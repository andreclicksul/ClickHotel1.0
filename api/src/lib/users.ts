const BRAZIL_TIMEZONE = 'America/Sao_Paulo'

const getBrazilNowMinutes = () => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: BRAZIL_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  const parts = formatter.formatToParts(new Date())
  const hour = Number.parseInt(
    parts.find((part) => part.type === 'hour')?.value ?? '0',
    10,
  )
  const minute = Number.parseInt(
    parts.find((part) => part.type === 'minute')?.value ?? '0',
    10,
  )

  return hour * 60 + minute
}

const toMinutes = (hours: string, minutes: string) => {
  const parsedHours = Number.parseInt(hours ?? '0', 10)
  const parsedMinutes = Number.parseInt(minutes ?? '0', 10)

  const h = Number.isNaN(parsedHours) ? 0 : parsedHours
  const m = Number.isNaN(parsedMinutes) ? 0 : parsedMinutes

  return (h % 24) * 60 + (m % 60)
}

export const difTime = (HH1: string, mm1: string, HH2: string, mm2: string) => {
  const start = toMinutes(HH1, mm1)
  const finish = toMinutes(HH2, mm2)
  const now = getBrazilNowMinutes()

  if (start === finish) {
    return false
  }

  return start > finish
    ? !(now >= start || now <= finish)
    : now < start || now > finish
}
