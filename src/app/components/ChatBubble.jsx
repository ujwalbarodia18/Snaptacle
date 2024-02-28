import React from 'react';
import '../stylesheets/chatBubble.css';

const ChatBubble = ({owner, message}) => {
  return (
    <div className={`main-chat-bubble + ${owner ? 'owner' : ''}`} data-testid="chat-bubble">
        <div className="container-bubble">
            <p>{message}</p>
        </div>
    </div>
    
  )
}

export default ChatBubble