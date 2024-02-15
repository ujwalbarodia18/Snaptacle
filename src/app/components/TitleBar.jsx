'use client'
import React, { useEffect } from 'react'
import { RiArrowLeftLine, RiChat1Line, RiShutDownLine } from "@remixicon/react";
import '../stylesheets/titlebar.css'
import { useRouter } from 'next/navigation';
import axios from 'axios'
import Cookies from 'js-cookie'

const TitleBar = ({title, icon, page, getUserId}) => {
  // const cookiess = document.cookie.split('=');
  // const [userId, setUserId] = useState();
  console.log('Cookie: ', Cookies.get('token'));
  const router = useRouter();
  const handleLogout = () => {
    Cookies.remove('token');
    // const cookies = document.cookie.split(';');

    // Loop through each cookie and set its expiration to the past
    // cookies.forEach(cookie => {
    //   const cookieParts = cookie.split('=');
    //   const cookieName = cookieParts[0].trim();
    //   document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    // });
    router.push('/login');
  }


  const getUser = async() => {
    try {
      const response = await axios.post('http://localhost:8080/getUser',{
        authorization: Cookies.get('token')
      });
      getUserId(response.data.user);
    }
    catch(err) {
      console.log('Error in getting user in TB: ', err);
    }
  }

  useEffect(() => {
    getUser()
  }, []);

  const handleBack = () => {
    router.push('/chat');
  }

  const handleChat = () => {
    router.push('/chat');
  }

  const fontChanger = title == 'Snaptacle' ? 'main-title' : 'other-title';
  return (
    <div className='titlebar'>
      {
        icon === 'back' &&  
        <RiArrowLeftLine
              size={30} 
              color="white" 
              className="my-icon"    
              onClick={handleBack}           
          />          
      }
      
      <div className={fontChanger}>{title}</div>
      {/* <div onClick={handleLogout}> */}
      <div className='right-icon'>
        {
          page != 'chat' &&
          <RiChat1Line
              size={30} 
              color="white" 
              className="my-icon"    
              onClick={handleChat}           
          />
        }
        

        <RiShutDownLine
              size={30} 
              color="white" 
              className="my-icon"    
              onClick={handleLogout}           
          />
        </div>
      {/* </div> */}
    </div>
  )
}

export default TitleBar