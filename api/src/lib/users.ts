export const difTime = (HH1: string, mm1: string, HH2: string, mm2: string) => {
  const dateStart = new Date()
  dateStart.setHours(parseInt(HH1), parseInt(mm1), 0, 0)

  const dateFinish = new Date()
  dateFinish.setHours(parseInt(HH2), parseInt(mm2), 0, 0)

  const now = new Date()

  return dateStart > dateFinish
    ? !(now >= dateStart || now <= dateFinish)
    : now < dateStart || now > dateFinish
}
