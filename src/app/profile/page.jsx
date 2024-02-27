'use client'
import React, { useEffect, useState } from 'react'
import TitleBar from '../components/TitleBar'
import NavBar from '../components/NavBar'
import ProfileImg from '../components/ProfileImg'
import ProfileDetails from '../components/ProfileDetails'
import ProfilePost from '../components/ProfilePost'
import '../stylesheets/profile.css'
import { useRouter } from 'next/navigation';
import axios from 'axios'
import Cookies from 'js-cookie'
// import '../../../../server/public/images/uploads/'
// import './[profileId]'
// import '../../../server/images/uploads/newimg.jpg'

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState();
  const [own, setOwn] = useState();
  const [following, setFollowing] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [posts, setPosts] = useState(0);
  const url = './neww.jpeg';

  console.log(router)

  const handleProfile = async() => {    
    try {
      // const cookiess = document.cookie.split('=');
      const response = await axios.post('http://localhost:8080/profile', {
        authorization: Cookies.get('token')
      });
      console.log(response); // Display success message or handle accordingly
      setUser(response.data.user);
      setPosts(response.data.user.posts?.length);
      setFollowing(response.data.user.following?.length);
      setFollowers(response.data.user.followers?.length);
      setOwn(response.data.own);
      // console.log('Ujwal: ', user)
      // console.log('Ujwal1: ', response.data.user)
      router.push('/profile')
    } catch (error) {
      localStorage.clear();
      router.push('/login')
      console.error('Registration failed', error);
    }
  }

  const handleOpenPost = (post_id) => {
    // console.log(post_id);
    try{
    //   const response = await axios.post(`http://localhost:8080/post/${post_id}`);
    //   console.log('Post retreived: ', response);
      router.push(`/post/${post_id}`);
    }
    catch(err) {
      console.log(err)
    }
  }

  const handleProfileDetailsClick = (idx) => {
    console.log('Click Followers: ', idx)
    idx === 1 ? router.push(`/followers/${user._id}`) : router.push(`/following/${user._id}`);
  }

  const handleEditProfile = () => {
    router.push('/editProfile');
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
                <ProfileDetails number={user?.posts.length} text='Posts'/>
                <div onClick={handleProfileDetailsClick.bind('null', 1)}>
                  <ProfileDetails number={user?.followers.length} text='Followers'/>
                </div>
                <div onClick={handleProfileDetailsClick.bind('null', 2)}>
                  <ProfileDetails number={user?.following.length} text='Following'/>
                </div>
            </div>
          </div>

          <div className="user-details">
            <div className="username"><strong>{user?.name}</strong></div>
            <p className="bio">
              
              {user?.bio}
            </p>
          </div>

          <div className="profile-page-buttons">
              <button className='edit-btn' onClick={handleEditProfile}>Edit Profile</button>        
          </div>
        </div>
        
        <div className="profile-posts-area">
          {user?.posts?.map((ele) => {
            return <div onClick={handleOpenPost.bind('null', ele._id)}>
              <ProfilePost src={ele.image} />
            </div>
          })}
        </div>
      </div>
      <NavBar selected={4}></NavBar>
    </div>
    </div>
    </div>
  )
}

export default Profile