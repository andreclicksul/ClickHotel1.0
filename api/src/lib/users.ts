export const difTime = (date1: Date, date2: Date) => {
  const HH1: number = date1.getHours()
  const mm1: number = date1.getMinutes()

  const HH2: number = date2.getHours()
  const mm2: number = date2.getMinutes()

  const dateStart = new Date(2023, 1, 1, HH1, mm1)
  const dateFinish = new Date(2023, 1, 1, HH2, mm2)

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
