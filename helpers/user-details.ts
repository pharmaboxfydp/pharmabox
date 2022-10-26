import { User } from '@prisma/client'
import { IncomingMessage, ServerResponse } from 'http'
import prisma from '../lib/prisma'
import { ServerSideAuth } from '@clerk/types/dist/ssr'

export type SSRUserResponse =
  | Promise<{
      props: {
        user: Record<string, any>
      }
    }>
  | {
      props: {
        userId: any
      }
    }

export function serialize(o: User | null): Record<string, any> {
  return JSON.parse(JSON.stringify(o))
}

export async function getUserDetails(userId: string) {
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

export function SSRUser({
  req
}: {
  req: IncomingMessage & { auth: ServerSideAuth }
  res: ServerResponse<IncomingMessage>
}): SSRUserResponse {
  const { userId } = req.auth
  if (userId) {
    return getUserDetails(userId)
  }
  return { props: { userId } }
}
