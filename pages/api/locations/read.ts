// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // retrieve location by id or don't specify body to retrieve all
  if (req.method === 'POST') {
    try {
      if (typeof req.body === 'string') {
        req.body = JSON.parse(req.body)
      }
      const { id: I } = req.body
      const id: number = I as number
      let location = null

      if (id) {
        location = await prisma.location.findUniqueOrThrow({
          where: {
            id: id
          },
          include: {
            Prescriptions: true,
            LockerBoxes: true
          }
        })
      } else {
        location = await prisma.location.findMany()
      }
      res.status(200).json({ message: 'Success', location })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
