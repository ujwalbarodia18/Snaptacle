import React from 'react'
import { RiHomeLine, RiSearchLine, RiUserLine, RiAddBoxLine, RiBookmarkLine } from "@remixicon/react";
import { RiHomeFill, RiSearchFill, RiUserFill, RiAddBoxFill, RiBookmarkFill } from "@remixicon/react";
import Link from 'next/link';
import '../stylesheets/navbar.css'

const Navbar = ({selected}) => {
  return (
    <div className='navbar'>
      <Link href='/feed'>
      {selected == 1 ? <RiHomeFill
            size={30} 
            color="white" 
            className="my-icon nav-icon" 
        /> 
        : <RiHomeLine
            size={30} 
            color="white" 
            className="my-icon nav-icon" 
        />}
      </Link>

      <Link href='/search/account'>
       
       {selected == 2 ? <RiSearchFill
            size={30} 
            color="white" 
            className="my-icon nav-icon" 
        /> 
        : <RiSearchLine
            size={30} 
            color="white" 
            className="my-icon nav-icon" 
        />} 
      </Link>
        
      <Link href='/addPost'>
        {selected == 3 ? <RiAddBoxFill
            size={30} 
            color="white" 
            className="my-icon nav-icon" 
          /> 
          : <RiAddBoxLine 
                  size={30} 
                  color="white" 
                  className="my-icon nav-icon" 
                />}
      </Link>
        
      <Link href='/profile'>
        {selected == 4 ? <RiUserFill
            size={30} 
            color="white" 
            className="my-icon nav-icon"
          /> 
          : <RiUserLine
              size={30} 
              color="white" 
              className="my-icon nav-icon"
          />}
      </Link>

      <Link href='/saved'>
        {selected == 5 ? <RiBookmarkFill
            size={30} 
            color="white" 
            className="my-icon nav-icon"
          /> 
          : <RiBookmarkLine
              size={30} 
              color="white" 
              className="my-icon nav-icon"
          />}
      </Link>
    </div>
  )
}

export default Navbar