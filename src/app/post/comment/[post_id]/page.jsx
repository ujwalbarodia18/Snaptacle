'use client'
import React, { useEffect, useState } from 'react'
import TitleBar from '../../../components/TitleBar'
import Comment from '../../../components/Comment'
import Navbar from '@/app/components/NavBar'
import '../../../stylesheets/comments.css'
import axios from 'axios'
import Cookies from 'js-cookie'
const apiurl = process.env.NEXT_PUBLIC_APIURL;

const page = ({params}) => {
    const [comment, setComment] = useState('');
    const [allComments, setAllComments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const handleComment = async () => {
        try {
            const response = await axios.post(`${apiurl}/addComment/${params.post_id}`, {comment, authorization: Cookies.get('token')});            
            setComment('')
            console.log(response);
            getComments();
        }
        catch(err) {
            console.log('Error in Handling comment: ', err);
        }
        
        console.log('Comment Post')
    }

    const getComments = async() => {
        try {
            const response = await axios.post(`${apiurl}/getComments/${params.post_id}`, {authorization: Cookies.get('token')});
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
    <body className='comments-main'>
      <div className='comments-container'>        
        <div className="comments-container">
        <TitleBar title='Comments' />
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
          <Navbar selected={10}/>
        </div>        
      </div>
      
    </body>
  )
}

export default page