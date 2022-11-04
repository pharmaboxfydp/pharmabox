import { Patient, Staff, User } from '@prisma/client'
import { IncomingMessage, ServerResponse } from 'http'
import prisma from '../lib/prisma'
import { ServerSideAuth } from '@clerk/types/dist/ssr'
import { User as ClientUser } from '../types/types'

export type SSRUserResponse<R> =
  | Promise<{
      props: {
        user: R
      }
    }>
  | {
      props: {
        userId: string | null
      }
    }

export type UserSettingsDetails = null | {
  props: {
    user: ClientUser
    patientDetails?: Patient
    staffDetails?: Staff
  }
}

export function serialize<R, T>(o: T | null): R {
  return JSON.parse(JSON.stringify(o))
}

export async function getUserDetails<R>({
  userId,
  query
}: {
  userId: string
  query?: null | Record<string, any>
}): Promise<{
  props: {
    user: R
  }
}> {
  const withQuery: boolean = query !== null
  return prisma.user
    .findUnique({
      where: {
        id: userId
      },
      ...(withQuery && query),
      include: {
        Patient: true
      }
    })
    .then((user) => {
      return { props: { user: serialize<R, User>(user) } }
    })
}

export function SSRUser<R>({
  req,
  query = null
}: {
  req: IncomingMessage & { auth: ServerSideAuth }
  res: ServerResponse<IncomingMessage>
  query?: null | Record<string, any>
}): SSRUserResponse<R> {
  const { userId } = req.auth
  if (userId) {
    return getUserDetails<R>({ userId, query })
  }

  return { props: { userId } }
}
