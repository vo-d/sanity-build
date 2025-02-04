import React from 'react'
import {sanityClient, urlFor} from '../../sanity.js'
import Header from '../../components/Header'
import type {Post} from '../../typings'
import { GetStaticProps } from 'next'
import PortableText from 'react-portable-text'
import {useForm} from 'react-hook-form'

// interface for item
interface formItemType{
    _id:string,
    name:string,
    email:string,
    comment:string,
}

interface Props{
    post: Post
}

function Post({post} : Props) {
    console.log(post)
    const {register, handleSubmit, formState:{errors}} = useForm<formItemType>();
    const onSubmit = async(data:formItemType) =>{
        await fetch("/api/createComment",{
            method:'POST',
            body: JSON.stringify(data)
        }).then((response)=>{ // print out response from server 
            response.json().then(data =>{console.log(data.message)})
        })
    } 

    return (
        <main>
            <Header />

            <img className='w-full h-40 object-cover' src={urlFor(post.mainImage).url()} alt="" />

            <article className='max-w-3xl mx-auto'>
                <h1 className='text-3xl mt-10 mb-3'>{post.title}</h1>
                <h2 className='text-xl font-light text-gray-500'>{post.description}</h2>
                <div className='flex items-center space-x-2'>
                    <img className=' h-10 w-10 rounded-full' src={urlFor(post.author.image).url()} alt="" />
                    <p className='font-extralight text-sm'>Blog post by <span className='text-green-600'>{post.author.name}</span> - Published at {new Date(post._createAt).toLocaleString()}</p>
                </div>
                    <div className=''>
                        <PortableText
                        dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
                        projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
                        content={post.body}
                        serializers={
                            {
                                h1: (props:any)=>{
                                    <h1 className='text-2xl font-bold my-5' {...props}/>
                                },
                                h2: (props:any)=>{
                                    <h1 className='text-xl font-bold my-5' {...props}/>
                                },
                                link: ({href, children} : any) =>{
                                    <a href={href} className='text-blue-500 hover:underline'>{children}</a>
                                }
                            }
                        }
                        ></PortableText>
                    </div>
                    <hr className=' max-w-lg mx-auto border border-yellow-500'/>

                    <form action="" className='flex flex-col p-5 max-w-2xl mx-auto mb-10' onSubmit={handleSubmit(onSubmit)}>
                        <h3 className=' text-sm text-yellow-500'>Enjoyed this article?</h3>
                        <h4 className='text-3xl font-bold'>Leave a comment below!</h4>
                        <hr className='py-3 mt-2'/>
                        
                        <input 
                        {...register('_id', {required:true})}
                        type="hidden" 
                        name="_id" 
                        value={post._id}/>

                        <label className='block mb-5'>
                            <span className='text-gray-700'>Name</span>
                            <input {...register('name', {required:true})} className='shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring' placeholder='Your Name' type="text" />
                        </label>
                        <label className='block mb-5'>
                            <span className='text-gray-700'>Email</span>
                            <input {...register('email', {required:true})} className='shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring' placeholder='Your email' type="text" />
                        </label>
                        <label className='block mb-5'>
                            <span className='text-gray-700'>Comment</span>
                            <textarea {...register('comment', {required:true})}  className='shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring' placeholder='Your comment' rows={8} />
                        </label>
                        <div className='flex flex-col p-5'>
                            {errors.name && (
                                <span className='text-red-500'>The Name Field is required</span>
                            )}
                            {errors.email && (
                                <span className='text-red-500'>The Email Field is required</span>
                            )}
                            {errors.comment && (
                                <span className='text-red-500'>The Comment Field is required</span>
                            )}
                        </div>
                        <input type="submit" className='shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer' />
                    </form>
                    <div className='flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-yellow-500 shadow space-y-2'>
                        <h3 className=' text-4xl'>Comments</h3>
                        <hr className=' pb-2'/>
                        {post.comments.map((comment) => (
                            <div key={post._id}>
                                <p><span className='text-yellow-500'>{comment.name}</span>: {comment.comment}</p>
                            </div>
                        ))}
                    </div>
            </article>
        </main>
        
    )
}

// prerender (not server side render so the page is built before user click the link to this page -> faster)
export const getStaticPaths = async() =>{
    const query = `*[_type=="post"]{
        _id,
        slug,}`;
    
    const posts = await sanityClient.fetch(query);

    const paths = posts.map((post : Post)=>({
        params:{
            slug: post.slug.current
        }
    }))
    return {
        paths,
        fallback: 'blocking'
    }
}

// get data for each slug
export const getStaticProps : GetStaticProps = async({params}) =>{
    const query = `*[_type=="post" && slug.current==$slug][0]{
        _id,
        _createAt,
        title,
        author ->{
          name, image
        },
        'comments': *[
            _type == 'comment' &&
            post._ref == ^._id && 
            approve == true
        ],
        description,
        mainImage, 
        slug,
        body
    }`

    const post = await sanityClient.fetch(query, {slug: params?.slug});
    if (!post){
        return{
            notFound: true
        }
    }

    return {
        props:{
            post
        },
        revalidate: 60 // after 60 sec, it will update change
    }
}

export default Post;