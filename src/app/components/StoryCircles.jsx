'use client'
import React from 'react'
import '../stylesheets/storyCircle.css'
import { RiAddLine } from "@remixicon/react";

export const StoryCircles = ({user, circle}) => {
  // console.log('User: ', user)
  return (
    <div className="story-circle-main">
        <div className={`story-img ${circle && 'story-img-circle'}`}>
          <img src={user?.profileImg} alt="" />
          <div className="my-icon-add-div">
            <RiAddLine
              size={25}
              color='white'
              className= {`my-icon my-icon-add ${circle && 'my-icon-hide'}`}
              />
          </div>
        </div>
        <p>{circle ? user?.username : 'Add Story'}</p>
    </div>
  )
}

export default StoryCircles
