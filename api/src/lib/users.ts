export const difTime = (HH1: string, mm1: string, HH2: string, mm2: string) => {
  const dateStart = new Date(2023, 1, 1, parseInt(HH1) - 3, parseInt(mm1))
  const dateFinish = new Date(2023, 1, 1, parseInt(HH2) - 3, parseInt(mm2))

  const toDay = new Date()
  const HH3: number = toDay.getHours() - 3
  const mm3: number = toDay.getMinutes()

  const _now = new Date(2023, 1, 1, HH3, mm3)

  let res = false

  if (
    _now.getTime() < dateStart.getTime() ||
    _now.getTime() > dateFinish.getTime()
  )
    res = true

  return res
}
