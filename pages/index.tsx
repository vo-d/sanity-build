
import Head from 'next/head'
import {Post} from '../typings'
import Header from '../components/Header'
import {sanityClient, urlFor} from "../sanity.js"

interface Props{
  posts: [Post]
}

export default function Home({posts} : Props) {
  console.log(posts)
  return (
    <div className=' max-w-7xl mx-auto'>
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className=' flex justify-between items-center bg-yellow-400 border-y border-black'>
        <div className=' p-10 space-y-5'>
          <h1 className='text-6xl max-w-xl font-serif'><span className=' underline decoration-black decoration-4'>Medium</span> is a place to write, read, and connect</h1>
          <h2>It's easy and free to poast your thinking on any topic and connect with millions of readers.</h2>
        </div>
        <img className=' hidden md:inline-flex h-32 lg:h-full' src="pngwing.com.png" alt="" />
      </div>
    </div>
  )
}



export const getServerSideProps = async() =>{
  const query = `*[_type == "post"]{
    _id,
      title,
      slug,
      author ->{
        name, image,
      },
      description,
      mainImage,
      slug
  }`;

  const posts =  await sanityClient.fetch(query)
  return{
    props:{
      posts
    }
  }
}