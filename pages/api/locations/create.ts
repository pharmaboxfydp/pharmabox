import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      if (typeof req.body === 'string') {
        req.body = JSON.parse(req.body)
      }
      const { address: A, phoneNumber: P } = req.body.data
      const address = JSON.stringify(A) as string
      const phoneNumber = P as string

      const location = await prisma.location.create({
        data: {
          address: address,
          phoneNumber: phoneNumber
        }
      })
      res.status(200).json({ message: 'Success', location })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
