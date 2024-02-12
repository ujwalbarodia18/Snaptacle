'use client'
import React, { useState } from 'react'
import TitleBar from '../../components/TitleBar'
import Navbar from '@/app/components/NavBar'
import '../../stylesheets/searchTags.css'
import ProfilePost from '@/app/components/ProfilePost'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const page = () => {
    const [posts, setPosts] = useState();
    const router = useRouter();
    const cookiess = document.cookie.split('=');
    const getPost = async(e) => {
        try {
            const response = await axios.post('http://localhost:8080/search/tags', {
                searchTag: e.target.value,
                authorization: cookiess[1]
            })
            // console.log(response);
            setPosts(response.data.posts);
        }
        catch(err) {
            router.push('/login')
            console.log('Error in getting tag Post: ', err);
        }
    }

    const handleToggle = (e) => {
        router.push('/search/account')
      }

    const handlePostClick = (post_id) => {
        router.push(`/post/${post_id}`);
    }
  return (
    <div className="tags-main">
        <div className="tags-container">
            <div className="search-bar">
                <input type="text" placeholder='Search' onChange={getPost}/>
            </div>

            <div className="search-page-buttons">
                <button className='inactive' onClick={handleToggle}>Accounts</button>
                <button className='active'>Posts</button>
            </div>

            <div className="search-area">
            {/* <ProfilePost src='.././default-dp.jpg' /> */}
                {
                    posts?.map((post) => {
                        return <div onClick={handlePostClick.bind('null', post._id)}> 
                                <ProfilePost src={'../' + post.image} />
                            </div>
                    })
                }
            </div>

            <Navbar selected={2}></Navbar>
        </div>
    </div>
  )
}

export default page