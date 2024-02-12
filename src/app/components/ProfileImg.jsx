import React from 'react'
import '../stylesheets/profileImg.css'

const ProfileImg = ({src, profile}) => {
  return (
    <div className="main-profile-img">
        {profile ? <img src={src} className='big-img' alt=""/> : <img src={src} className='small-img' alt=""/>}
        
    </div>
  )
}

export default ProfileImg