'use client'
import React, { useEffect, useState } from 'react'
import TitleBar from '@/app/components/TitleBar'
import Navbar from '@/app/components/NavBar'
import Post from '@/app/components/Post'
import '../../stylesheets/post.css'
// import '../../stylesheets/navbar.css'
// import '../../stylesheets/titlebar.css'
import '../../stylesheets/soloPost.css'
import axios from 'axios'

const page = ({params}) => { 
    const [post, setPost] = useState();
    const cookiess = document.cookie.split('=');
    const handlePage = async() => {
        try{
            const response = await axios.post(`http://localhost:8080/post/${params.id}`, {
                authorization: cookiess[1]
            });
            console.log('Post retreived: ', response);
            await setPost(response.data.post);
        }
        catch(err) {
            console.log('Error')
            console.log(err)
        }
    }

    useEffect(() => {
        handlePage();
    }, [])
    
  return (
    <div className='main'>
        <div className="container">
            <TitleBar title='Post'/>
            <div className='solo-post-area'>
                {post && <Post post={post}/>} 
            </div> 
            <Navbar selected={10}></Navbar>    
        </div>
    </div>
  )
}

export default page