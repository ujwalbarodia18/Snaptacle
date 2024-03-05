"use client";
import React, { useState, useEffect, useRef } from "react";
import TitleBar from "@/app/components/TitleBar";
import "../../../stylesheets/chat.css";
import ChatBubble from "../../../components/ChatBubble";
import axios from "axios";
import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie'
const apiurl = process.env.NEXT_PUBLIC_APIURL;

const socketPORT = process.env.NEXT_PUBLIC_APIURL;

const secretKey = 'th!s!ismysecretk$y';

import { useRouter } from 'next/navigation';
import { io } from "socket.io-client";

const socket = io(socketPORT, {
	query: { token: Cookies.get('token') },
});

const page = ({ params }) => {
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState();
	const [message, setMessage] = useState("");
	const [username, setUsername] = useState('');
	const router = useRouter();
    const [userId, setUserId] = useState();
	const inputRef = useRef();
	
	const getChats = async () => {
		try {
			const response = await axios.post(
				`${apiurl}/getChat/${params.roomId}`,
				{
					authorization: Cookies.get('token'),
				}
			);

			const userRes = await axios.post(`${apiurl}/getUser/${params.userId}`, {
				authorization: Cookies.get('token'),
			});
			console.log(response.data);
			setUsername(userRes.data.user.username);
			console.log('Usrename', userRes)
			// setRoomId(res)
			const resMessage = response.data.chat.chats?.map((chat) => {
				const decrypted = CryptoJS.AES.decrypt(chat.message, secretKey).toString(CryptoJS.enc.Utf8);
				return {
					message: decrypted,
					owner: chat.user == params.userId ? false : true,
				};
			});
			setMessages(resMessage);
		} catch (err) {
			console.log("Error in getting chats: ", err);
		}
	};

    const getUserId = (user) => {
        setUserId(user._id);
		setUsername(user.username)
    }
	
	useEffect(() => {
		getChats();        
	}, []);

		socket.on(params.roomId, (m) => {
			console.log("Message: ", m);
			const decrypted = CryptoJS.AES.decrypt(m, secretKey).toString(CryptoJS.enc.Utf8);
			setMessages([...messages, { message: decrypted, owner: false }]);
		});

	const handleSend = async () => {
		const inputValue = inputRef.current.value;
		if (!inputValue) {
			return;
		}
		setMessage(inputValue);
		const encrypted = CryptoJS.AES.encrypt(inputValue, secretKey).toString();
        socket.emit("join-chat", params.roomId);
		socket.emit(params.roomId, { id: params.roomId, message: encrypted});
        setMessages([...messages, { message: inputValue, owner: true }]);
		setNewMessage("");
		setMessage("");
		inputRef.current.value = '';
	};

	return (
		<div className="main-chats">
			<div className="container-chats">
				<TitleBar title={username} icon="back" page="chat" getUserId={getUserId}/>
				<div className="chat-area">
					{messages?.map((message) => {
						return (
							<ChatBubble
								className="owner"
								owner={message.owner}
								message={message.message}
							/>
						);
					})}
				</div>

				<div className="message-input">
					<input
						type="text"
						ref={inputRef}
						placeholder="Type message..."
					/>
					<button className="message-input-btn" onClick={handleSend}>
						Send
					</button>
				</div>
			</div>
		</div>
	);
};

export default page;
