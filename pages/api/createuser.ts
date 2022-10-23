// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

type User = {
//   id: string,
  name: string,
  email: string,
//   createadAt: Date,
//   updatedAt: Date

}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User>
) {
    if (req.method === 'POST') {
        // Process a POST request
        try {
            console.log(req.body.data)
            // const {name, email} = req.body
            // const user = await prisma.user.create({data: {
            //     name: name,
            //     email: email,
            //   },})
            // console.log(user)
            res.status(200).json({ email: 'Success', name:'Works' })
        } catch(e) {
            console.log(e)
            res.status(400).json({ email: 'Fail', name:'Duplicate' })

        }
      }

//   res.status(200).json({ message: 'John Doe', name:'hi' })
}
