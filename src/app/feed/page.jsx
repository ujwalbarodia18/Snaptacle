'use client'
import React, { useEffect, useState } from 'react';
import TitleBar from '../components/TitleBar'
import StoryCircles from '../components/StoryCircles'
import Posts from '../components/Posts'
import NavBar from '../components/NavBar'
import axios from 'axios'
import '../stylesheets/feed.css'
import '../stylesheets/posts.css'
import CommentSection from '../components/CommentSection'
import Cookies from 'js-cookie'

import { useRouter } from 'next/navigation';
const apiurl = process.env.NEXT_PUBLIC_APIURL;

const Feed = () => {
  const router = useRouter();
  const [posts, setPosts] = useState();
  const [user, setUser] = useState();
  const [stories, setStories] = useState();

  const [usersWithStories, setUsersWithStories] = useState();
  const [currIdx, setCurrIdx] = useState();

  const [post_id, setPost_id] = useState(null);
  
  const postFeed = async() => {
    console.log('Feed')
    try {
      const res = await axios.post(`${apiurl}/feed`, {
        authorization: Cookies.get('token')
      });

      // console.log('Res: ', res);
      setPosts(res.data.posts);
      setUser(res.data.user);
      setUsersWithStories(res.data.userWithStories);
      console.log('Agg: ', res.data.agg);
      console.log('Post: ', res.data.posts)
    }
    catch(err) {
      console.log(err)
      router.push('/login');
    }
  }

  const getStories = async(user_id, idx) => {
    try {
      const response = await axios.post(`${apiurl}/getStories/${user_id}`, {
        authorization: Cookies.get('token')
      });
      setStories(response.data.stories);  
      setCurrIdx(idx);
      router.push(`/story/${user_id}`);      
    }
    catch(err) {
      console.log('Error in getStories: ', err)
    }    
  }

  const openStory = (user_id) => {
    router.push(`/story/${user_id}`);
  }

  const handleCreateStory = async() => {
      router.push('/createStory');
  }

  const setPostId = (id) => {
    setPost_id(id);
  }

  useEffect(() => {
    postFeed();
  }, [])

  return (
    <div className="main">
      <div className={post_id ? 'container-blur' : 'container'}>
          <TitleBar title='Snaptacle'></TitleBar>
          <div className="posts">
            <div className="story-section">
              <div className='story-circle-main' onClick={handleCreateStory}>
                <StoryCircles user={user} circle={false}/>
              </div>
              {
                usersWithStories?.map((user, idx) => {
                  return <div className='story-circle-main story-circle-border' onClick={getStories.bind('null', user._id, idx)}> <StoryCircles user={user} circle={true}/> </div> 
                })
              }
            </div>
            <Posts posts={posts} setPostId={setPostId}/>
          </div>
          <NavBar selected={1}></NavBar>
      </div>      
      {
        post_id &&
        <div className="comment-section">
          <CommentSection post_id={post_id} setPostId={setPostId} />
        </div>   
      }
       
    </div>
  )
}

export default Feed