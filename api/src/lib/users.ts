export const difTime = (date1: string, date2: string) => {
  const datetemp1 = date1.substring(11, 2)

  console.log(datetemp1)

  /*
  const [HH1, mm1] = timetemp1.split(':')

  console.log(HH1, mm1)
  return false

  const HH1: number = parseInt(date1.substr(11, 2))
  const mm1: number = parseInt(date1.substr(14, 2))

  const HH2: number = parseInt(date2.substr(11, 2))
  const mm2: number = parseInt(date2.substr(14, 2))



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
  */
}
