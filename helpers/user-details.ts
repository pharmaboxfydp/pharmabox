import { User } from '@prisma/client'
import prisma from '../lib/prisma'

export function serialize(o: User | null): Record<string, any> {
  return JSON.parse(JSON.stringify(o))
}

export default async function getUserDetails(userId: string) {
  return prisma.user
    .findUnique({
      where: {
        id: userId
      }
    })
    .then((user) => {
      return { props: { user: serialize(user) } }
    })
}
