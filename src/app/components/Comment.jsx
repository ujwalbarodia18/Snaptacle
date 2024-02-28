import React from 'react'
import { useRouter } from 'next/navigation';
import '../stylesheets/comment.css'

const Comment = ({comment}) => {
  const router = useRouter();
  const openProfile= (user_id)  => {
    router.push(`/profile/${user_id}`);
  }
  return (
    <div className="main-comment">
        <div className="comment-img">
            <img src={comment.user.profileImg} alt="" />
        </div>
        <div className="comment-details">
            <h6 onClick={openProfile.bind(`null`, comment.user._id)}>{comment.user.username}</h6>
            <p>{comment.comment}</p>
        </div>
    </div>
  )
}

export default Comment