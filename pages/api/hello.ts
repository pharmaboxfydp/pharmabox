// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import connection from '../../database'
type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  connection().then((knex) => {
    const state = knex.queryBuilder()
    console.log(state)
    debugger
  })
  res.status(200).json({ name: 'John Doe' })
}
