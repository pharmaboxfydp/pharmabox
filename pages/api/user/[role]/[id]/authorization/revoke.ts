import { Staff } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../../../lib/prisma'
import { Role } from '../../../../../../types/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { id: targetUserId, role: targetRole } = req.query

      if (typeof targetUserId !== 'string') {
        throw new Error(
          `invalid request. expected user id of type 'string' but received type: ${typeof targetUserId}`
        )
      }

      if (typeof req.body === 'string') {
        req.body = JSON.parse(req.body)
      }
      const { authorizerUserId: AUID } = req.body.data
      const authorizerUserId: string = AUID

      const authorizerUser = await prisma.pharmacist.findUnique({
        where: {
          userId: authorizerUserId
        }
      })

      let user
      if (authorizerUser) {
        /**
         * if a pharmacist is trying to revoke themselves we should allow them.
         */
        if (
          authorizerUser.userId === targetUserId &&
          targetRole === Role.Pharmacist
        ) {
          user = await prisma.pharmacist.update({
            where: {
              userId: targetUserId
            },
            data: {
              isOnDuty: false
            }
          })
          /**
           * We need to revoke all of the staff who are authorized under the current pharmacist
           * We have to do this iteratively according to this open issue:
           * https://github.com/prisma/prisma/issues/3143
           */
          const connectedStaff = await prisma.staff.findMany({
            where: {
              authorizer: user
            }
          })
          connectedStaff.forEach(async (staff: Staff) => {
            await prisma.staff.update({
              where: {
                id: staff.id
              },
              data: {
                isAuthorized: false,
                authorizer: {
                  disconnect: true
                }
              }
            })
          })
        }
        /**
         * when a pharmacist is attempting to revoke someone else
         *
         */
        if (authorizerUser.userId !== targetUserId) {
          if (authorizerUser.isOnDuty) {
            /** if the target role to revoke is another pharmacist */
            if (targetRole === Role.Pharmacist) {
              user = await prisma.pharmacist.update({
                where: {
                  userId: targetUserId
                },
                data: {
                  isOnDuty: false
                }
              })
            }
            /** if the target role to authorize is a staff member */
            if (targetRole === Role.Staff) {
              user = await prisma.staff.update({
                where: {
                  userId: targetUserId
                },
                data: {
                  isAuthorized: false,
                  authorizer: {
                    disconnect: true
                  }
                }
              })
            }
          } else {
            /** if the user is not authorized because they themselves are not authorized or if they are a staff member */
            res.status(403).json({
              message:
                'The current user is not authorized to perform this action and must first authorize themselves.'
            })
          }
        }
      } else {
        res.status(403).json({
          message: 'The current user is not authorized to perform this action'
        })
      }

      res.status(200).json({ message: 'Success', user })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
