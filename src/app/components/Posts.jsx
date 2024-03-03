import React from 'react';
import Post from './Post';

const Posts = ({posts, setPostId}) => {
  return (
    <div>
      { posts?.map((post, idx) => {              
        return <div key={idx} data-testid={post._id}>
          <Post  post={post} setPostId={setPostId}/>
        </div>
      })

      }
      </div>
  )
}

export default Posts