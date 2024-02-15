'use client'
import React, { useEffect, useState } from 'react'
import TitleBar from '../../components/TitleBar'
import NavBar from '../../components/NavBar'
import ProfileImg from '../../components/ProfileImg'
import ProfileDetails from '../../components/ProfileDetails'
import ProfilePost from '../../components/ProfilePost'
import '../../stylesheets/profile.css'
import { useRouter } from 'next/navigation';
import axios from 'axios'

const ProfileOther = ({params}) => {
  const router = useRouter();
  const [user, setUser] = useState();
  const [own, setOwn] = useState();
  const [following, setFollowing] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [posts, setPosts] = useState(0);
  const [isFollowing, setIsFollowing] = useState();

  const cookiess = document.cookie.split('=');
  const handleProfile = async() => {
    try {
      console.log('ID: ' ,params.profileId)      
      const response = await axios.post(`http://localhost:8080/profile/${params.profileId}`, {
        authorization: cookiess[1]
      });
      console.log(response); // Display success message or handle accordingly
      await setUser(response.data.currUser)
      // router.push('../feed');
      setOwn(response.data.own);
      setPosts(response.data.currUser.posts?.length);
      setFollowing(response.data.currUser.following?.length);
      setFollowers(response.data.currUser.followers?.length);
      setIsFollowing(response.data.isFollowing);
      
      router.push(`/profile/${params.profileId}`)
    } catch (error) {
      localStorage.clear();
      console.error('Registration failed', error);
    }
  }

  const handleFollow = async() => {
    try {
      const response = await axios.post(`http://localhost:8080/follow/${params.profileId}`, {
        authorization: cookiess[1]
      });
      console.log(response)

      setIsFollowing(response.data.message)
      setFollowing(response.data.following);
      setFollowers(response.data.followers);
    }
    catch(err) {
      console.log(err)
    }
  }

  const handleProfileDetailsClick = (idx) => {
    console.log('Click Followers: ', idx)
    idx === 1 ? router.push(`/followers/${user._id}`) : router.push(`/following/${user._id}`);
  }

  const handleOpenPost = (post_id) => {
    try{
      router.push(`/post/${post_id}`);
    }
    catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {
    handleProfile();
  }, []);

  return (
    <div className="main">
      <div className="container">
    <div className="main-profile">      
      <TitleBar title={user?.username}></TitleBar>
      <div className="profile">        
        <div className="profile-info-container">
          <div className="profile-details">
            <ProfileImg src={user?.profileImg} profile={true} />
            <div className='container-profile-details'>
            <ProfileDetails number={posts} text='Posts'/>
                <div onClick={handleProfileDetailsClick.bind('null', 1)}>
                  <ProfileDetails number={followers} text='Followers'/>
                </div>
                <div onClick={handleProfileDetailsClick.bind('null', 2)}>
                  <ProfileDetails number={following} text='Following'/>
                </div>
            </div>
          </div>

          <div className="user-details">
            <div className="username"><strong>{user?.name}</strong></div>
            <p className="bio">
              {user?.bio}
              {/* {user?.bio} */}
            </p>
          </div>

          <div className="profile-page-buttons">          
            {
              own ? <button className='edit-btn' >Edit Profile</button> : isFollowing ? <button className='following-btn' onClick={handleFollow}>Following</button> : <button className='edit-btn profile-follow-btn' onClick={handleFollow}>Follow</button>
            }
          </div>
        </div>
        
        <div className="profile-posts-area">        
          {user?.posts?.map((ele) => {
              const url = ele.image;
              return <div onClick={handleOpenPost.bind('null', ele._id)}>
                <ProfilePost src={url} />
              </div>
          })}
        </div>
      </div>
      <NavBar selected={10}></NavBar>
    </div>
    </div>
    </div>
    
  )
}

export default ProfileOther