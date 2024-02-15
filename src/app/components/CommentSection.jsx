'use client'
import React, { useEffect, useState } from 'react'
import TitleBar from './TitleBar'
import Comment from './Comment'
import Navbar from './NavBar'
import '../stylesheets/comments.css'
import axios from 'axios'

const CommentSection = ({params}) => {
    const [comment, setComment] = useState('');
    const cookiess = document.cookie.split('=');
    const [allComments, setAllComments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const handleComment = async () => {
        try {
            const response = await axios.post(`http://localhost:8080/addComment/${params.post_id}`, {comment, authorization: cookiess[1]});            
            setComment('')
            console.log(response);
            getComments();
            // setAllComments(response.data.comments);
            // setLoading(false)
        }
        catch(err) {
            console.log('Error in Handling comment: ', err);
        }
        
        console.log('Comment Post')
    }

    const getComments = async() => {
        try {
            const response = await axios.post(`http://localhost:8080/getComments/${params.post_id}`, {authorization: cookiess[1]});
            console.log(response);
            setAllComments(response.data.comments);
            setLoading(false)
        }
        catch (err) {
            console.log('Error in getting comments: ', err);
        }
    }

    useEffect(() => {
        getComments();
    }, []);

    useEffect(() => {
        console.log('COMENTS: ', allComments)
    }, [allComments])
    
  return (
    <div className='comments-main'>
      <div className='comments-container'>        
        <div className="comments-container">
            <div className="title-bar">
                <div>Comments</div>
            </div>
          <div className="comments-area">
            {   loading ? <p>Loading...</p> :
                allComments?.map((comment) => {
                    return <Comment comment={comment}/>
                })
            }
          </div>

          <div className="comments-input">
            <input type="text" placeholder='Type Comment here' onChange={e => setComment(e.target.value)} value={comment}/>
            <button className='comments-input-btn' onClick={handleComment}>Post</button>
          </div>
        </div>        
      </div>
      
    </div>
  )
}

export default CommentSection