import { GetStaticProps } from 'next'
import React, { useState } from 'react'
import Header from '../../components/Header'
import { sanityClient, urlFor} from "../../sanity"
import { Post } from '../../typings'
import PortableText from "react-portable-text"
import { useForm, SubmitHandler, UseFormGetValues } from "react-hook-form";


interface IForm {
  _id: string
  name: string
  email: string
  comment: string
}



type Props = {
    post: Post
}

function Post({post}: Props) {
  // console.log(post)
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<IForm>();
  const onSubmit: SubmitHandler<IForm> = (data) => {
    // console.log(data)
    // PUSH TO THE SANITY CMS
    // dont need await async coz of .then(() => function() {
     fetch(`/api/createComment`, {
      method: 'POST',
      body: JSON.stringify(data),
    }).then(() => {
      console.log(data)
      setSubmitted(true)
    })
    .catch((error) => {
      console.log(error)
      setSubmitted(false);
    })
   
  };

  return (
    <main>
        <Header />
        <img 
        className='w-full h-40 object-cover'
        src={urlFor(post.mainImage).url()} alt="" />
        <article className='max-w-3xl mx-auto p-5'>
            <h1 className='text-3xl mt-10 mb-3'>{post.title}</h1>
            <h2 className='text-xl font-light text-gray-500 mb-2'>{post.description}</h2>
            <div className='flex items-center space-x-2'>
                <img 
                className='h-10 w-10 rounded-full'
                src={urlFor(post.author.image).url()} alt="" />
                <p className='font-extralight text-sm'>
                    Block Post by: <span className='text-green-600'>{post.author.name}</span> - Published at {" "}
                    {new Date(post._createdAt).toLocaleDateString()}
                </p>
            </div>
            <div className='mt-10'>
              <PortableText 
              className=''
                      projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID} // "pv8y60vp"
                      dataset={process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}// "production"
                      content={post.body}
                      serializers={{
                        h1: (props: any) => <h1 className='text-2xl font-bold my-5' {...props} />,
                        h2: (props: any) => <h2 className='text-2xl font-bold my-5' {...props} />,
                        li: ({ children }: any) => <li className="ml-6 list-disc">{children}</li>,
                        link: ({href, children }: any) => <a href={href} className="text-blue-600 hover:underline">{children}</a>,
                      }}
                      
                      />
                    
            </div>

        </article>
        <hr className='max-w-lg my-5 mx-auto border border-yellow-500'/>
        {submitted ? (
        <div className='flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto'>
          <h3 className='text-3xl bold'>Thank you for submitting..</h3>
          <p>Once approved appear here!!</p>
        </div>
        ): (
          <form className='flex flex-col p-5 my-10 max-w-2xl mx-auto' onSubmit={handleSubmit(onSubmit)}> 
          <h3 className='text-sm text-yellow-400'>Enjoy the article</h3>
          <h4 className='text-3xl font-bold'>Leave a comment below</h4>
          <hr className='py-3 mt-2'/>
  
          <input 
         {...register("_id")}
          type='hidden'
          name='_id'
          value={post._id}
          
          
          />
            <label className='block mt-5'>
              <span className='text-gray-700 '>
                Name
              </span>
              <input 
                     {...register("name", { required: true})}
  
              className='shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring' type="text" placeholder='JOhn Doe' />
              </label>
              <label className='block mt-5'>
              <span className='text-gray-700 '>
                Email
              </span>
              <input 
                {...register("email", { required: true})}
  
              
              className='shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring' type="text" placeholder='JOhn Doe' />
              </label>
              <label className='block mt-5'>
              <span className='text-gray-700 '>
               Comment
              </span>
              <textarea 
                {...register("comment", { required: true})}
  
              className='shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring' rows={8} placeholder='JOhn Doe' />
              </label>
  
              <div className='flex flex-col pt-2'>
                {errors.name && (
                  <span className='text-red-400'>The Name field is required</span>
                )
                }
                {errors.email && (
                  <span className='text-red-400'>The Email field is required</span>
                )
                }
                {errors.comment && (
                  <span className='text-red-400 '>The Comment field is required</span>
                )
                }
                
              </div>
              <input className="bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 mt-4 px-4 rounded cursor-pointer" type="submit" />
             
          </form>


        )}
        <div className='flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-yellow-400 shadow space-y-2'>
          {/* comments */}
          <h3 className='text-4xl'>Comments</h3>
          <hr className='pb-2'/>
          {post.comments.map((comment) => (
            <div key={comment._id}>
              <p><span className='text-yellow-500 '>

                {comment.name}
              </span>
              :   {" "}
                {comment.comment}</p>
            </div>
          ))}
        </div>
       

        
    </main>
  )
}

export default Post



// implementation of getStaticPaths ---> ISR increment static generation
// by giving us the slugs...>
export const getStaticPaths = async () => {
    const query = `*[_type == 'post']{
        _id, 
      slug
        
      } `;
      const posts = await sanityClient.fetch(query);
      const paths = posts.map((post: Post) => ({
        params: {
            slug: post.slug.current

        }
      }));
      return {
        paths,
        // block when page not found azing 404 page
        fallback: 'blocking',
      };
     

};
// getting rhe pareams..
// using the slugs ....>
export const getStaticProps: GetStaticProps = async ({ params}) => {
    const query = `*[_type == 'post' && slug.current == $slug][0] {
  
      _id, 
      _createdAt,
      title,
      author -> {
      name,
      image,
    },
    'comments': *[
      _type == "comment" &&
      post._ref == ^._id && approved == true
    ],
    description,
    mainImage,
    slug,
    body
      
    }`;
      const post = await sanityClient.fetch(query, {
        slug: params?.slug,

      });
      if(!post) {
        return {
            notFound: true,

      }
    
}
return {
    props: {
        post,
    },
    revalidate: 60,

}
}

// && slug.current == 'my-second-post'
