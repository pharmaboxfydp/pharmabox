import { Webhook } from "svix";
import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
    api: {
        bodyParser: false,
    },
}

const secret = process.env["CLERK_SIGNING_KEY"] || "";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse

) {
    const payload = (await req).toString();
    const headers = req.headers;

    const wh = new Webhook(secret);
    let msg;

    try {
        msg = wh.verify(payload, headers);
    } catch (err) {
        res.status(400).json({});
    }
    
    // Do something with the message...

    res.json({});
}