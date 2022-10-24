import prisma from '../lib/prisma'

export default async function getUserDetails(userId: string) {
  return prisma.user
    .findUnique({
      where: {
        id: userId
      }
    })
    .then((user) => {
      return { props: { user } }
    })
}
