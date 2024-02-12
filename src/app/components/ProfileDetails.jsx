import React from 'react'
import '../stylesheets/profileDetails.css'

const ProfileDetails = ({number, text}) => {
  return (
    <div className="main-profile-details">
        <p>{number}</p>
        <p>{text}</p>
    </div>
  )
}

export default ProfileDetails