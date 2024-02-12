'use client'
// import '../stylesheets/story.css'
import '../stylesheets/story.css'
import { RiCloseFill } from "@remixicon/react";
import React, { useEffect, useState } from 'react'
import ProfileImg from '@/app/components/ProfileImg'
import axios from 'axios'
import { useRouter } from 'next/navigation';

const Story = ({story}) => {
    const router = useRouter();
    const handleClose = () => {
        router.push('/feed');
    }
  
    return (
    <div className='story-main'>
        <div className="story-container">
            <div className='top-bar'>
                <div className="story-user-detail">
                    <ProfileImg src={'../../default-dp.jpg'}/>
                    <p>user</p>
                </div>
                <div onClick={handleClose}>
                    <RiCloseFill
                        size={30} 
                        color="white" 
                        className="my-icon" 
                    /> 
                </div>
            </div>
            <div className="story-content">
                <img src={'../../' + story?.image} alt="" />
            </div>
        </div>
    </div>
  )
}

export default Story