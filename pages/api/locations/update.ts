// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
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
      const {
        id,
        streetAddress,
        cardinalDirection,
        city,
        province,
        country,
        phoneNumber
      } = req.body.data

      const location = await prisma.location.update({
        where: {
          id: id
        },
        data: {
          streetAddress: streetAddress,
          cardinalDirection: cardinalDirection,
          city: city,
          province: province,
          country: country,
          phoneNumber: phoneNumber
        }
      })

      res.status(200).json({ message: 'Success', location: location })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e?.toString() })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
