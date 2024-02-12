'use client'

import React from 'react'
import { RiShutDownLine } from "@remixicon/react";
import '../stylesheets/titlebar.css'
import { useRouter } from 'next/navigation';

const TitleBar = ({title}) => {
  const router = useRouter();
  const handleLogout = () => {
    const cookies = document.cookie.split(';');

    // Loop through each cookie and set its expiration to the past
    cookies.forEach(cookie => {
      const cookieParts = cookie.split('=');
      const cookieName = cookieParts[0].trim();
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    router.push('../login');
  }
  const fontChanger = title == 'Snaptacle' ? 'main-title' : 'other-title';
  return (
    <div className='titlebar'>
      <div className={fontChanger}>{title}</div>
      {/* <div onClick={handleLogout}> */}
        <RiShutDownLine
              size={30} 
              color="white" 
              className="my-icon"    
              onClick={handleLogout}           
          />
      {/* </div> */}
    </div>
  )
}

export default TitleBar