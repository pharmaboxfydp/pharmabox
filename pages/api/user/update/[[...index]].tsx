import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'
import { User } from '../../../../types/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const {
        first_name,
        last_name,
        id,
        email_addresses,
        primary_email_address_id,
        phone_numbers,
        primary_phone_number_id,
        created_at,
        updated_at
      } = req.body.data

      let email_address: string = ''

      email_address =
        email_addresses.find(
          ({ id }: { id: string }) => id === primary_email_address_id
        )?.email_address ?? null
      let phone_number: string | undefined = undefined
      phone_number =
        phone_numbers.find(
          ({ id }: { id: string }) => id === primary_phone_number_id
        )?.phone_number ?? null

      let createdAt: Date = new Date(created_at)
      let updatedAt: Date = new Date(updated_at)

      const payload: User = {
        id: id,
        firstName: first_name,
        lastName: last_name,
        email: email_address,
        phoneNumber: phone_number,

        // send ISO strings to Postgres so that it can construct correct dates
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString()
      }
      const user = await prisma.user.update({
        where: { id: id },
        data: payload as any
      })

      res.status(200).json({ message: 'Success', user: user })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
