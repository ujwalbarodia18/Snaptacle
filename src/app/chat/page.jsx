'use client'
import React, { useEffect, useState } from 'react'
import '../stylesheets/chat.css'
import TitleBar from '../components/TitleBar'
import Navbar from '../components/NavBar'
// import UserChat from '../components/UserChat'
import SearchResult from '../components/SearchResult'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const page = () => {
    const [chatUsers, setChatUsers] = useState();
    const router = useRouter();
    const chatPage = async() => {
        try {
            const cookiess = document.cookie.split('=');
            const response = await axios.post('http://localhost:8080/getChatUser', {
                authorization: cookiess[1]
            });
            console.log('Chat user: ', response);
            setChatUsers(response.data.chatUsers)
        }
        catch(err) {
            console.log(err)
        }
    }

    const handleOpenChat = (user_id) => {
        router.push(`/chat/${user_id}`);
    }

    useEffect(() => {
        chatPage();
    }, [])
  return (
    <div className="main-chats">
        <div className="container-chats">
            <TitleBar title='Chats' page='chat'/>
            <div className="list-area">
                {
                    chatUsers?.map((user) => {
                        return <div onClick={handleOpenChat.bind('null', user._id)}> <SearchResult user={user}/>         </div>                        
                    })
                }                
            </div>
            <Navbar selected={10}/>
        </div>
    </div>
  )
}

export default page