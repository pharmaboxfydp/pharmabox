// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

type User = {
    id: string,
    name: string,
    email: string,
    //   createadAt: Date,
    //   updatedAt: Date

}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        // Process a POST request
        try {
            const { 
                first_name, 
                last_name, 
                id, 
                email_addresses,
                primary_email_address_id, 
                primary_phone_number_id,
                created_at,
                updated_at,
                banned, 
            } = req.body.data
            
            console.log(email_addresses)
            console.log(primary_email_address_id)

            console.log(req.body.data)
            // const user = await prisma.user.create({data: {
            //     id: id,
            //     first_name: first_name,
            //     last_name,
            //     // email: primary_email_address_id,
            //     phone: primary_phone_number_id,
            //     banned: banned,
            //     createdAt: created_at.toString(),
            //     updatedAt: updated_at.toString()
            //   },})
            // console.log(user)
            res.status(200).json({ message: 'Success', id: "user.id" })
        } catch (e) {
            console.log(e)
            res.status(400).json({ message: 'Fail', })

        }
    }

    //   res.status(200).json({ message: 'John Doe', name:'hi' })
}
