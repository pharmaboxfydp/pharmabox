import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import * as argon2 from 'argon2'
import { Status } from '../../../types/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { qrCode } = req.body
      let unfilled_prescriptions = await prisma.prescription.findMany({
        where: {
          status: Status.Unfilled
        }
      })

      unfilled_prescriptions.forEach(async (prescription) => {
        let is_valid_code = await argon2.verify(qrCode, prescription.pickupCode)
        if (is_valid_code) {
          await prisma.prescription.update({
            data: {
              status: Status.Filled
            },
            where: {
              id: prescription.id
            }
          })

          res.status(200).json({ message: ' Success', qrCode })
        }
      })

      res.status(200).json({ message: 'INVALID QR code', qrCode })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
