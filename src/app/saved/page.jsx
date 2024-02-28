'use client'
import React, { useEffect, useState } from 'react'
import '../stylesheets/saved.css'
import TitleBar from '../components/TitleBar';
import Navbar from "../components/NavBar";
import ProfilePost from '../components/ProfilePost';
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie';
const apiurl = process.env.NEXT_PUBLIC_APIURL;

const page = () => {
    const router = useRouter();
    const [savedPosts, setSavedPosts] = useState([]);
    // const cookiess = document.cookie.split('=');
    const getPost = async() => {
        try {
            const response = await axios.post(`${apiurl}/getSavedPost`, {
                authorization: Cookies.get('token')
            })
            console.log(response);
            setSavedPosts(response.data.saved.saved);
        }
        catch(err) {
            router.push('/login')
            console.log('Error in getting saved Post: ', err);
        }
    }

    const handlePostClick = (post_id) => {
        router.push(`/post/${post_id}`);
    }

    useEffect(() => {
        getPost();
    }, [])
  return (
    <main className='saved-main'>
      <div className='saved-container'>
        <TitleBar title='Saved' />
        <div className='main-area'>
        <div className="saved-post-area">
            {
                savedPosts?.map((post) => {
                    return <div onClick={handlePostClick.bind('null', post._id)}> 
                            <ProfilePost src={post.image} />
                        </div>
                })
            }
        </div>
        </div>
        <Navbar selected={5}/>
      </div>
    </main>
  )
}

export default page