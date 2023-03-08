import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'
import { LockerBoxState, Status } from '../../../../types/types'

interface IncommingRequest extends NextApiRequest {
  body: {
    data: {
      prescriptionId: number
    }
  }
}

export default async function handler(
  req: IncommingRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      if (typeof req.body === 'string') {
        req.body = JSON.parse(req.body)
      }

      const { prescriptionId } = req.body.data

      const prescription = await prisma.prescription.findUniqueOrThrow({
        where: {
          id: prescriptionId
        },
        include: {
          Patient: {
            include: {
              User: true
            }
          },
          LockerBox: true,
          Location: true
        }
      })

      if (prescription) {
        const updatedPrescription = await prisma.prescription.update({
          data: {
            status: Status.PickupCompleted
          },
          where: {
            id: prescription.id
          }
        })
        const updatedLockerBox = await prisma.lockerBox.update({
          where: {
            id: prescription.lockerBoxId
          },
          data: {
            status: LockerBoxState.empty
          }
        })
        return res
          .status(200)
          .json({ message: 'Success', updatedPrescription, updatedLockerBox })
      } else {
        return res
          .status(401)
          .json({ message: 'Invalid Authorization', prescriptionId })
      }
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
