'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import SearchList from '@/app/components/SearchList';
import SearchResult from '@/app/components/SearchResult';
import TitleBar from '@/app/components/TitleBar';
import Navbar from '@/app/components/NavBar';
import '../../stylesheets/search.css'
import { useRouter } from 'next/navigation'

const page = ({params}) => {
    const router = useRouter();
    const [user, setUser] = useState(null)
    const cookiess = document.cookie.split('=');;
    const handlePage = async() => {
        try {
            const response = await axios.post(`http://localhost:8080/getUser/${params.user_id}`, {authorization: cookiess[1]});
            // console.log(response);
            await setUser(response.data.user.followers);
        }
        catch (err) {
            console.log(err)
        }
    }
    const handleClick = async(id) => {
        const cookiess = document.cookie.split('=');
        
        try {
          const response = await axios.post(`http://localhost:8080/profile/${id}`, {        
            authorization: cookiess[1]
          });
    
          console.log(response); // Display success message or handle accordingly
          setUser(response.data.user)
          // router.push('../feed');
          router.push(`/profile/${id}`);
    
        //   console.log(id)
          // setOwn(response.data.own);
          // router.push({
          //   pathname: '../profile',
          //   query: {data: 'data'}
          // })
    
        }
        catch (err) {
        //   localStorage.clear();
        //   router.push('../login')
          console.error('Open Profile: ', err);
        }
        // console.log('Click')
    }

    useEffect(() => {
        handlePage();
    }, [])
  return (
    <div className='main'>
        <div className="container">
            <TitleBar title='Followers'/>
            <div className='search-area'>
            {user?.map(userr => 
                    <div onClick={handleClick.bind(null, userr._id)} >
                        <SearchResult key={user._id} user={userr}/>
                    </div>
                )}
            </div>
            <Navbar selected={10}/>
        </div>
    </div>
  )
}

export default page