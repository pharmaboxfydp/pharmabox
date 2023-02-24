import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { page, take, search } = req.query
      if (
        (page || take) &&
        (typeof page !== 'string' || typeof take !== 'string')
      ) {
        throw new Error('Expected page and take of type string')
      }

      const fuzz = search as string
      const patients = await prisma.user.findMany({
        ...(page &&
          take && {
            skip: (parseInt(page) - 1) * parseInt(take),
            take: parseInt(take)
          }),

        where: {
          role: 'patient',
          ...(fuzz && {
            OR: [
              {
                firstName: {
                  contains: fuzz
                },
                lastName: { contains: fuzz },
                phoneNumber: {
                  contains: fuzz
                },
                email: { contains: fuzz }
              }
            ]
          })
        },
        include: {
          Patient: {
            include: {
              Prescriptions: true
            }
          }
        }
      })
      const numPatients: number = patients.length
      res.status(200).json({ message: 'Success', patients, numPatients })
    } catch (e) {
      debugger
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
