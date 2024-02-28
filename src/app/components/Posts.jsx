import React from 'react';
import Post from './Post';

const Posts = ({posts, setPostId}) => {
  return (
    <div>
      { posts?.map((post, idx) => {
        return <Post key={idx} post={post} setPostId={setPostId}/>
      })

      }

      </div>
  )
}

export default Posts