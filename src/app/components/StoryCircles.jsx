'use client'
import React from 'react'
import '../stylesheets/storyCircle.css'
import { RiAddLine } from "@remixicon/react";

export const StoryCircles = ({user, circle}) => {
  return (
    <div className="story-circle-main" data-testid="story-circle-main">
        <div className={`story-img ${circle && 'story-img-circle'}`}>
          <img src={user?.profileImg} alt="" />
          <div className="my-icon-add-div" data-testid="add-icon">
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
