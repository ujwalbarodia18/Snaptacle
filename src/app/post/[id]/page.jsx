'use client'
import React, { useEffect, useState } from 'react'
import TitleBar from '@/app/components/TitleBar'
import Navbar from '@/app/components/NavBar'
import Post from '@/app/components/Post'
import CommentSection from '@/app/components/CommentSection'

import '../../stylesheets/post.css'
import '../../stylesheets/soloPost.css'
import '../../stylesheets/postPage.css'

import axios from 'axios'
import Cookies from 'js-cookie'
const apiurl = process.env.NEXT_PUBLIC_APIURL;

const page = ({params}) => { 
    const [post, setPost] = useState();
    const [post_id, setPost_id] = useState(null);
    const handlePage = async() => {
        try{
            const response = await axios.post(`${apiurl}/post/${params.id}`, {
                authorization: Cookies.get('token')
            });
            console.log('Post retreived: ', response);
            await setPost(response.data.post);
        }
        catch(err) {
            console.log('Error')
            console.log(err)
        }
    }

    const setPostId = (id) => {
        setPost_id(id);
      }

    useEffect(() => {
        handlePage();
    }, [])
    
  return (
    <div className='main'>
        <div className={post_id ? 'container-blur' : 'container'}>
            <TitleBar title='Post'/>
            <div className='solo-post-area'>
                {post && <Post post={post} setPostId={setPostId}/>} 
            </div> 
            <Navbar selected={10}></Navbar>    
        </div>

        {
        post_id &&
            <div className="comment-section">
              <CommentSection post_id={params.id} setPostId={setPostId} />
            </div>   
        }        
    </div>
  )
}

export default page