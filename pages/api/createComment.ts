import SanityClient from '@sanity/client'
import { NextApiRequest, NextApiResponse } from 'next'

// copy from sanity.js but add token
// new config for posting data to sanity: include api token
const config = {
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    apiVersion: "v2021-10-21",
    useCdn: process.env.NODE_ENV ===  "production",
    token: process.env.SANITY_API_TOKEN
}

// createClient is for fetching, SanityClient is for posting
const client = SanityClient(config)
export default async function handler(req: NextApiRequest, res: NextApiResponse){
    if(req.method === 'POST'){
        const {_id, name, email, comment} = JSON.parse(req.body)
        try{
            await client.create({
                _type:"comment",
                post:{
                    _type:'reference',
                    _ref: _id 
                },
                name: name,
                email: email,
                comment: comment
            })
        }catch(err){
            return res.status(500).json({message:"Couldn't submit comment", err})
        }

        // Send back response 
        res.status(200).json({message:"I'm so done"})
    }
}