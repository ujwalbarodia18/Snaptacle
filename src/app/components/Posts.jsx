import React from 'react';
import Post from '../components/Post';

const Posts = ({posts}) => {
  return (
    <div>
      { posts?.map((post, idx) => {
        return <Post key={idx} post={post} />
      })

      }

      </div>
  )
}

export default Posts