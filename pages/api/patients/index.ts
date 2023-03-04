import type { NextApiRequest, NextApiResponse } from 'next'
import { stripNonDigets } from '../../../helpers/validators'
import prisma from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const {
        page,
        take,
        firstName,
        lastName,
        phoneNumber,
        email,
        onlyEnabled
      } = req.query

      if (
        (page || take) &&
        (typeof page !== 'string' || typeof take !== 'string')
      ) {
        throw new Error('Expected page and take of type string')
      }

      const pickupEnabled: boolean = onlyEnabled === 'true'

      const filter = {
        where: {
          role: 'patient',
          ...(pickupEnabled && {
            Patient: {
              pickupEnabled: pickupEnabled
            }
          }),
          ...(firstName?.length && {
            firstName: {
              contains: firstName as string,
              mode: 'insensitive' as any
            }
          }),
          ...(lastName?.length && {
            lastName: {
              contains: lastName as string,
              mode: 'insensitive' as any
            }
          }),
          ...(phoneNumber?.length && {
            phoneNumber: {
              contains: stripNonDigets(phoneNumber as string)
            }
          }),
          ...(email?.length && {
            email: {
              contains: email as string,
              mode: 'insensitive' as any
            }
          })
        }
      }

      const patients = await prisma.user.findMany({
        ...(page &&
          take && {
            skip: (parseInt(page) - 1) * parseInt(take),
            take: parseInt(take)
          }),
        ...filter,
        include: {
          Patient: {
            include: {
              Prescriptions: true
            }
          }
        },
        orderBy: [{ lastName: 'asc' }]
      })

      const numPatients: number = await prisma.user.count({ ...filter })

      res.status(200).json({ message: 'Success', patients, numPatients })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
