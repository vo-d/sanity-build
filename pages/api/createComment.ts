import type {NextApiRequest, NextApiResponse} from 'next'
import SanityClient from '@sanity/client'
import { json } from 'stream/consumers'

// copy from sanity.js but add token
export const config = {
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    useCdn: process.env.NODE_ENV === 'production',
    apiVersion:"v2021-10-21",
    token: process.env.SANITY_API_TOKEN,
}

const client = SanityClient(config)

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const {_id, name, email, comment} = JSON.parse(req.body)

    try{
        await client.create({
            _type: 'comment',
            post:{
                _type:'reference',
                _ref:_id
            },
            name,
            email,
            comment
        })
    } catch(err){
        return res.status(500).json({message:"Couldn't submit comment", err})
    }

    res.status(200).json({message:'Comment submitted'})
}