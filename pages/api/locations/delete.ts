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
      const { id: I } = req.body.data
      const id: number = I as number
      const location = await prisma.location.delete({
        where: {
          id: id
        }
      })

      res.status(200).json({ message: 'Success', location: location })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
