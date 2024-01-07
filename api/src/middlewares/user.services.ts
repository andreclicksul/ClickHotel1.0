export async function findUserAuthentication(objectUser: any) {
  const passwordHash = objectUser.password

  const user = {
    id: objectUser.id,
    user: objectUser.user,
    name: objectUser.name,
    email: objectUser.email,
    phone: objectUser.phone,
    starttime: objectUser.starttime,
    finishtime: objectUser.finishtime,
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
    expiresIn: '8h',
  }

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

  return {
    user,
    permissionDay,
    passwordHash,
  }
}
