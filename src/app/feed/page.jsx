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

import { useRouter } from 'next/navigation';


const Feed = () => {
  const router = useRouter();
  const [posts, setPosts] = useState();
  const [user, setUser] = useState();
  const [stories, setStories] = useState();

  const [usersWithStories, setUsersWithStories] = useState();
  const [currIdx, setCurrIdx] = useState();
  const cookiess = document.cookie.split('=');
  const postFeed = async() => {
    console.log('Feed')
    try {
      const res = await axios.post('http://localhost:8080/feed', {
        authorization: cookiess[1]
      });

      // console.log('Res: ', res);
      setPosts(res.data.posts);
      setUser(res.data.user);
      setUsersWithStories(res.data.userWithStories);
    }
    catch(err) {
      console.log(err)
      router.push('/login');
    }
  }

  const getStories = async(user_id, idx) => {
    try {
      const response = await axios.post(`http://localhost:8080/getStories/${user_id}`, {
        authorization: cookiess[1]
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

  // useEffect(() => {    
  //   // usersWithStories?.map((ele) => console.log('Stories: ', ele))
  // }, [usersWithStories])

  useEffect(() => {
    // console.log('In use')
    postFeed();
  }, [])

  return (
    <div className="main">
    <div className='container'>
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
          <Posts posts={posts}/>
        </div>
        <NavBar selected={1}></NavBar>
    </div>
    </div>
  )
}

export default Feed