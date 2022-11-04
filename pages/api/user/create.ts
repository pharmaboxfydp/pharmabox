import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { Role, User } from '../../../types/types'

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
        public_metadata
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
      const {
        is_admin: isAdmin,
        location_id: locationId,
        is_staff: isStaff
      } = public_metadata
      if (isStaff) {
      }
      const payload: User = {
        id: id,
        firstName: first_name,
        lastName: last_name,
        email: email_address,
        phoneNumber: phone_number,
        // send ISO strings to Postgres so that it can construct correct dates
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
        // always make default users be patients on production
        role: isStaff ? Role.Staff : Role.Patient
      }
      const user = await prisma.user.create({
        data: {
          ...payload,
          ...(!isStaff && {
            Patient: {
              connectOrCreate: {
                where: {
                  userId: id
                },
                create: {
                  pickupEnabled: true,
                  dob: null
                }
              }
            }
          }),
          ...(isStaff && {
            Staff: {
              connectOrCreate: {
                where: {
                  userid: id
                },
                create: {
                  isAdmin,
                  locationId
                }
              }
            }
          })
        }
      })
      res.status(200).json({ message: 'Success', user: user })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
