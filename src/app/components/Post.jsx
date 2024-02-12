'use client'
import React, { useState, useEffect } from 'react';
import '../stylesheets/post.css';
import ProfileImg from '../components/ProfileImg';
import axios from 'axios';
import { RiHeartLine, RiChat3Line, RiHeartFill, RiBookmarkLine, RiBookmarkFill } from "@remixicon/react";
import { useRouter } from 'next/navigation'

// import './../../../public/'
const Post = ({post}) => {
  const [like, setLike] = useState();
  const [saved, setSaved] = useState();
  const [totalLike, setTotalLike] = useState(0);
  const router = useRouter();
  const cookiess = document.cookie.split('=');
  const handlePost = async() => {
    try {
      const response = await axios.post(`http://localhost:8080/getPost/${post._id}`, {
        authorization: cookiess[1]
      });
      // console.log('Post-: ', response)
      await setLike(response.data.liked);
      setSaved(response.data.saved)
      await setTotalLike(response.data.post.likes.length);
      // await 
    }
    catch(err) {
      console.log(err);
    }
  }
  
  const handleLike = async() => {
    try{
      const response = await axios.post(`http://localhost:8080/like/${post._id}`, {
        authorization: cookiess[1]
      });
      console.log(response);
      await setLike(response.data.liked);
      if(!like) {
        setTotalLike(totalLike + 1);
      }
      else {
        setTotalLike(totalLike - 1);
      }
    }
    catch(err) {
      console.log(err)
    }
  }

  const handleSave = async() => {
    try {
      const response = await axios.post(`http://localhost:8080/save/${post._id}`, {
        authorization: cookiess[1]
      });
      console.log(response);
      await setSaved(response.data.saved);
    }
    catch(err) {
      console.log(err)
    }
  }
  
  const handleComment = () => {
    router.push(`/post/comment/${post._id}`);
  }

  const openProfile= (user_id)  => {
    router.push(`/profile/${user_id}`);
  }

  useEffect(() => {
    handlePost();
  }, [])
  return (
    <div className="post">
      <div className="post-title">
        <ProfileImg src={'./../../../' + post.user.profileImg} profile={false}/> 
        <p onClick={openProfile.bind(`null`, post.user._id)}>{post.user.username}</p>
      </div>
      <div className="post-img">
        <img src={'./../../../' + post.image} alt=""/>
      </div>
      <div className="interactions">
        <div onClick={handleLike}>
          {
            like ? <RiHeartFill
                  size={36} // set custom `width` and `height`
                  color="red" // set `fill` color
                  className="my-icon" // add custom class name
              />
              : <RiHeartLine
                  size={36} // set custom `width` and `height`
                  color="white" // set `fill` color
                  className="my-icon" // add custom class name
              />
          }
          
        </div>

        <div onClick={handleComment}>
          <RiChat3Line
              size={36} // set custom `width` and `height`
              color="white" // set `fill` color
              className="my-icon" // add custom class name
          />
        </div>

        <div onClick={handleSave}>
          {
            saved ? <RiBookmarkFill
                size={36} // set custom `width` and `height`
                color="white" // set `fill` color
                className="my-icon" // add custom class name
            /> : <RiBookmarkLine
            size={36} // set custom `width` and `height`
            color="white" // set `fill` color
            className="my-icon" // add custom class name
        />
          }
          
        </div>
      </div>
      <div className="post-caption">
        {
          totalLike>0 && <p>{totalLike} likes</p>
        }
        
        <p><strong onClick={openProfile.bind(`null`, post.user._id)}>{post.user.username}</strong> {post.caption}</p>
      </div>
    </div>
  );
}

export default Post