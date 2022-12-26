import { createClient } from "next-sanity";
import createImageUrlBuilder from '@sanity/image-url'


export const config = {
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    apiVersion:"v2021-10-21",
    /* set usdCdn to false if your app require the freshest possible data always (potentially slightly slower and a bit more expensive).
 authenticated request(like preview) will always bypass the CDN */
    useCdn: process.env.NODE_ENV === 'production'
}

//set up the client for fetching data in the getProps page functions
export const sanityClient = createClient(config);

// set up  a helper function for generating image URLs with only the asset reference data in your documents
export const urlFor = (source)=> createImageUrlBuilder(config).image(source)