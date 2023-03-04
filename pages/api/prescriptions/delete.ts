import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { LockerBoxState } from '../../../types/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query

      let prescription = await prisma.prescription.findUniqueOrThrow({
        where: {
          id: parseInt(id as string)
        }
      })

      await prisma.lockerBox.update({
        where: {
          id: prescription.lockerBoxId
        },
        data: {
          status: LockerBoxState.empty
        }
      })

      prescription = await prisma.prescription.delete({
        where: {
          id: parseInt(id as string)
        }
      })

      res.status(200).json({ message: 'Success', prescription })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
