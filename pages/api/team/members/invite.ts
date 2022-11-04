import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'
import * as dotenv from 'dotenv'
import prisma from '../../../../lib/prisma'

dotenv.config()

const BASE_URL = `https://api.clerk.dev/v1`

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      if (typeof req.body === 'string') {
        req.body = JSON.parse(req.body)
      }
      const { email: E, locationId: LI, isAdmin: A } = req.body.data
      const email: string = E
      const locationId: number = parseInt(LI)
      const isAdmin: boolean = A

      const currentUser = await prisma.user.findUnique({
        where: {
          email
        }
      })

      if (currentUser) {
        /**
         * if the user exists in our database then we can just update them
         */
        const staffUser = await prisma.user.update({
          where: {
            email
          },
          data: {
            Staff: {
              connectOrCreate: {
                where: {
                  userId: currentUser?.id
                },
                create: {
                  isAdmin,
                  locationId
                }
              }
            }
          },
          include: { Staff: true }
        })
        res
          .status(200)
          .json({ message: 'Success', staffUser, existingUser: true })
      } else {
        /**
         * the user does not exist so we are going to send them an email invite
         */
        const response = await fetch(`${BASE_URL}/invitations`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${process.env.CLERK_API_KEY}`
          },
          body: JSON.stringify({
            email_address: email,
            public_metadata: { is_admin: isAdmin, location_id: locationId }
          })
        })
        const invite = await response.json()
        if (response.status === 200) {
          res.status(200).json({
            message: 'Success',
            emailInvite: invite,
            existingUser: false
          })
        } else {
          res
            .status(400)
            .json({
              message: 'Unable to send email invite',
              error: invite,
              existingUser: false
            })
        }
      }
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
