export async function findUserAuthentication(objectUser: any) {
  const passwordHash = objectUser.password

  const user = {
    id: objectUser.id,
    user: objectUser.user,
    name: objectUser.name,
    email: objectUser.email,
    phone: objectUser.phone,
    client: objectUser.client,
    caduser: objectUser.caduser,
    checklist: objectUser.checklist,
    provider: objectUser.provider,
    audit: objectUser.audit,
    accountpay: objectUser.accountpay,
    accountreceive: objectUser.accountreceive,
    financial: objectUser.financial,
    product: objectUser.product,
    occupationmap: objectUser.occupationmap,
    color: objectUser.color,
    avatar: objectUser.avatar,
    starthour: objectUser.starthour,
    startminute: objectUser.startminute,
    finishhour: objectUser.finishhour,
    finishminute: objectUser.finishminute,
  }

  /*
  const weekDay: number = new Date().getDay()

  const dayUser = [
    objectUser.sunday,
    objectUser.monday,
    objectUser.tuesday,
    objectUser.wednesday,
    objectUser.thursday,
    objectUser.friday,
    objectUser.saturday,
  ]

  const permissionDay: boolean = dayUser[weekDay]
    */

  const isPermission = permissionDay(
    objectUser.sunday,
    objectUser.monday,
    objectUser.tuesday,
    objectUser.wednesday,
    objectUser.thursday,
    objectUser.friday,
    objectUser.saturday,
  )

  return {
    user,
    isPermission,
    passwordHash,
  }
}

export const permissionDay = (
  sunday: boolean,
  monday: boolean,
  tuesday: boolean,
  wednesday: boolean,
  thursday: boolean,
  friday: boolean,
  saturday: boolean,
): boolean => {
  const weekDay: number = new Date().getDay()

  const dayUser = [
    sunday,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
  ]

  const isPermission: boolean = dayUser[weekDay]

  return isPermission
}
