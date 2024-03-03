'use client'
// import '../stylesheets/story.css'
import '../stylesheets/story.css'
import { RiCloseFill } from "@remixicon/react";
import React, { useEffect, useState } from 'react'
import ProfileImg from '@/app/components/ProfileImg'
import { useRouter } from 'next/navigation';

const Story = ({story, username, src}) => {
    const router = useRouter();
    const handleClose = () => {
        router.push('/feed');
    }
    console.log('Story: ', story)
  
    return (
    <div className='story-main'>
        <div className="story-container">
            <div className='top-bar'>
                <div className="story-user-detail">
                    <ProfileImg src={src}/>
                    <p>{username}</p>
                </div>
                <div onClick={handleClose} data-testid="close-icon">
                    <RiCloseFill
                        size={30} 
                        color="white" 
                        className="my-icon" 
                    /> 
                </div>
            </div>
            <div className="story-content">
                <img src={story?.image} alt="" />
            </div>
        </div>
    </div>
  )
}

export default Story