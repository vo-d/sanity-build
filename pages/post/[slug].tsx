import React from 'react'
import {sanityClient, urlFor} from '../../sanity.js'
import Header from '../../components/Header'
import {Post} from '../../typings'
import { GetStaticProps } from 'next'


interface Props{
    post: Post
}

function Post({post} : Props) {
    console.log(post)
  return (
    <main>
        <Header />
    </main>
  )
}

// prerender (not server side render so the page is built before user click the link to this page -> faster)
export async function getStaticPaths(){
    const query = `*[_type=="post"]{
        _id,
        slug,
    }`
    
    const posts = await sanityClient.fetch(query);
    const paths = posts.map((post : Post)=>({
        params:{
            slug: post.slug.current
        }
    }))
    return{
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps : GetStaticProps = async({params}) =>{
    // get first item with given slug
    const query = `*[_type=="post" && slug.current == $slug][0]{
        _id,
        _createAt,
        title,
        author ->{
          name, image
        },
        description,
        mainImage, 
        slug,
        body
    }`

    const post = await sanityClient.fetch(query, {slug: params?.slug})

    if (!post){
        return{
            notFound: true
        }
    }

    return{
        props:{
            post
        }
    }
}

export default Post;