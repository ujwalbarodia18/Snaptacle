'use client'
import React, {useEffect, useState} from 'react'
import NavBar from '../../components/NavBar'
import SearchResult from '../../components/SearchResult'
import '../../stylesheets/search.css'
import axios from 'axios'
// import { Router } from 'next/router'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
const apiurl = process.env.NEXT_PUBLIC_APIURL;

// import { Redirect, Route, Routes, Router } from 'react-router-dom'


const Search = () => {
  const router = useRouter();
  const [result, setResult] = useState([]);
  const [users, setUsers] = useState([]);
  // const searchBar = document.querySelector('.search-bar>input');
  // const cookiess = document.cookie.split('=');
  const handleSearch = async() => {
    try {
      const response = await axios.post(`${apiurl}/search`, {
        authorization: Cookies.get('token')
      });
      console.log(response.data.users);
      setUsers(response.data.users);      
      // console.log(allUserssers);
      // setResult(...users);
    } catch (error) {
      console.error('Registration failed', error);
      router.push('/login')
    }
  }

  const filterUser = (e) => {        
    // const query = searchBar.value;
    // console.log(query)
    const regex = new RegExp(e.target.value, 'i');
    
    const list = users?.filter((user) => {
      return regex.test(user.name) || regex.test(user.username);
    })
    setResult(list);

    console.log('Res: ', result);
  }

  const handleToggle = (e) => {
    router.push('/search/tags')
  }

  const [user, setUser] = useState([]);
  const [own, setOwn] = useState();
  const handleClick = async(id) => {
    // const cookiess = document.cookie.split('=');
    
    try {
      const response = await axios.post(`${apiurl}/profile/${id}`, {        
        authorization: Cookies.get('token')
      });

      console.log(response); // Display success message or handle accordingly
      setUser(response.data.user)
      // router.push('../feed');
      router.push(`/profile/${id}`);

      console.log(id)
      // setOwn(response.data.own);
      // router.push({
      //   pathname: '../profile',
      //   query: {data: 'data'}
      // })

    }
    catch (err) {
      localStorage.clear();
      router.push('../login')
      console.error('Registration failed', err);
    }
    // console.log('Click')
  }

  useEffect(() => {
    // console.log(users);
    setResult(users);
  }, [users]);

  useEffect(() => {
    // console.log(result);
  }, [result]);

  useEffect(() => {
    handleSearch();
  }, [])

  return (
    <div className="main">
      <div className="container">
    <div className="main-search">
        <div className="search-bar">
            <input type="text" placeholder='Search' onChange={filterUser}/>
        </div>
        
        <div className="search-page-buttons">
          <button className='active'>Accounts</button>
          <button className='inactive' onClick={handleToggle}>Posts</button>
        </div>

        <div className="search-area">
          <div className='main-search-list' >
            {result?.map(user => 
                <div key={user._id} onClick={handleClick.bind(null, user._id)} >
                  <SearchResult  user={user}/>
                </div>
            )}
          </div>
        </div>

        <NavBar selected={2}></NavBar>
    </div>
    </div>
    </div>
  )
}

export default Search