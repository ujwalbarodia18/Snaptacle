'use client'
import React, { useState } from 'react'
import '../stylesheets/register.css'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Otp from '../components/Otp';
import Cookies from 'js-cookie';
import Loader from '../components/Loader';
const apiurl = process.env.NEXT_PUBLIC_APIURL;

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [authenticationError, setAuthenticationError] = useState(false)
  const [isOTP, setIsOTP] = useState(false);
  const [email, setEmail] = useState();
  const [token, setToken] = useState();
  const [loading, setLoading] = useState(false);
  
  
  const handleLogin = async(e) => {   
    e.preventDefault(); 
    setLoading(true);
    try {      
      const response = await axios.post(`${apiurl}/login`, {
          username,
          password
      });
      console.log(response)
      
      // console.log(token)
      if(response.data.token) {
        Cookies.set('token', response.data.token)
        setToken(response.data.token)  
        // axios.defaults.headers.common['Authorization'] = `${token}`;
        // localStorage.setItem('token', token)
        setLoading(false);
        setIsOTP(true)
        setEmail(response.data.email)
        // router.push('/login/');
      }
      else {
        console.error('Token not found in the server response');        
      }
      console.log(response.data); // Display success message or handle accordingly      
      // router.push('../profile')
    } catch (error) {
      setAuthenticationError(true);
      setLoading(false);
      console.error('Login failed', error);
    }
  }

  const closeOtp = () => {
    setIsOTP(false);
  }

  return (
    <div className='main'>
        <div className={isOTP ? 'container-blur' : 'container'} >
          <div className="main-register">
            <h1>Snaptacle</h1>
            <input type="text" placeholder='Username' name='username' onChange={e => setUsername(e.target.value)} required/>
            <input type="password" placeholder='Password' name='password' onChange={e => setPassword(e.target.value)} required/>
            { authenticationError &&
              <p className='login-failed'>Username or password is incorrect</p>
            }
            <button onClick={handleLogin}>Log in</button>
            <p>Not have an account? <Link className='highlight' href='/register'>Sign up</Link> </p>
          </div>          
        </div>

      {/* {loading && 
      <div className="uploading">
        <div><iframe src="https://giphy.com/embed/VseXvvxwowwCc"></iframe></div>
            <p>Uploading...</p>
      </div>} */}

    {loading && 
      <Loader/>}

        {isOTP && 
        <Otp email={email} token={token} closeOtp={closeOtp}/>}
    </div>
  )
}
export default Login