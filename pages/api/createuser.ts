// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import { Role, User } from '../../types/types'
//

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      let {
        first_name,
        last_name,
        id,
        email_addresses,
        primary_email_address_id,
        phone_numbers,
        primary_phone_number_id,
        created_at,
        updated_at,
        banned
      } = req.body.data
      let email_address = null
      email_address =
        email_addresses.find(
          ({ id }: { id: string }) => id === primary_email_address_id
        )?.email_address ?? null
      let phone_number = null
      phone_number =
        phone_numbers.find(
          ({ id }: { id: string }) => id === primary_phone_number_id
        )?.phone_number ?? null

      const payload: User = {
        id: id,
        first_name: first_name,
        last_name: last_name,
        email: email_address,
        phone: phone_number,
        banned: banned,
        createdAt: created_at.toString(),
        updatedAt: updated_at.toString(),
        // always make default users be patients
        role: Role.Patient
      }
      const user = await prisma.user.create({ data: payload })
      res.status(200).json({ message: 'Success', user: user })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
