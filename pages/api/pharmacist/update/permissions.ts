import { Pharmacist } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    let pharmacist: Pharmacist | null = null
    try {
      const request = JSON.parse(req.body) as { data: Pharmacist }
      const { isAdmin: A, userId: I } = request.data
      const userId: string = I
      const isAdmin: boolean = A
      pharmacist = await prisma.pharmacist.update({
        where: {
          userId
        },
        data: {
          isAdmin
        }
      })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
    res.status(200).json({ message: 'Success', pharmacist })
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
