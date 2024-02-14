'use client'
import React, { useState, useEffect } from 'react'
import TitleBar from '@/app/components/TitleBar'
import '../../stylesheets/chat.css'
import ChatBubble from '../../components/ChatBubble'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import io from 'socket.io-client';
const cookiess = document.cookie.split('=');


const socket = io('http://localhost:5000/', {
    query: {token: cookiess[1]}
});



const page = ({params}) => {

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState();

    const [message, setMessage] = useState('');
    const router = useRouter();    
    const [roomId, setRoomId] = useState('65cb4d11c1adf88f2e3258d065cb4d3ac1adf88f2e3258df');

    const getChats = async() => {
        try {
            const response = await axios.post(`http://localhost:8080/getChat/${params.userId}`, {
                authorization: cookiess[1]
            });
            console.log(response.data.chat);
            const resMessage = response.data.chat.chats?.map((chat) => {
                return {'message' : chat.message, 'owner': (chat.user == params.userId) ? false : true}
            });
            setMessages(resMessage);
            setRoomId(response.data.chat._id);
            // return response.data.chat._id;
        }
        catch(err) {
            console.log("Error in getting chats: ", err)
        }
    }



    useEffect(() => {
        getChats();     
    //     socket.emit('join-chat', {roomId});   
    }, []);

    const handleSend = async() => {
        if(!message) {
            return;
        }

        socket.emit('newMessage', {id: params.userId, message});
        setMessages([...messages, {'message': message, 'owner': true}])
        setNewMessage('');
        setMessage('');
    }

    socket.on(roomId.toString(), (m) => {
        console.log('Message: ', m)
        setMessages([...messages, {'message': m, 'owner': false}]); 
    });
  return (
    <div className="main-chats">
        <div className="container-chats">
            <TitleBar title='user' icon='back' page='chat'/>
            <div className="chat-area">
                {
                    messages?.map((message) => {
                        return <ChatBubble className='owner' owner={message.owner} message={message.message}/>
                    })
                }
            </div>
        
            <div className="message-input">
                <input type="text" placeholder='Type message...' onChange={e => setMessage(e.target.value)} value={message}/>
                <button className='message-input-btn' onClick={handleSend}>Send</button>
            </div>
        </div>
    </div>
  )
}

export default page