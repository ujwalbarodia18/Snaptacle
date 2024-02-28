'use client'
import React, { useEffect, useState } from 'react'
import Comment from './Comment'
import '../stylesheets/comments.css'
import axios from 'axios'
import Cookies from 'js-cookie'
const apiurl = process.env.NEXT_PUBLIC_APIURL;
import { RiCloseFill } from "@remixicon/react";

const CommentSection = ({post_id, setPostId}) => {
    const [comment, setComment] = useState('');
    // const cookiess = document.cookie.split('=');
    const [allComments, setAllComments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const handleComment = async () => {
        try {
            const response = await axios.post(`${apiurl}/addComment/${post_id}`, {comment, authorization: Cookies.get('token')});            
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
            const response = await axios.post(`${apiurl}/getComments/${post_id}`, {authorization: Cookies.get('token')});
            console.log(response);
            setAllComments(response.data.comments);
            setLoading(false)
        }
        catch (err) {
            console.log('Error in getting comments: ', err);
        }
      }
    
      const closeComment = () => {
        setPostId(null);
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
        <div onClick={closeComment} className='close-icon'>
                    <RiCloseFill
                        size={30} 
                        color="white" 
                        className="my-icon" 
                    /> 
                </div>
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
      
  )
}

export default CommentSection