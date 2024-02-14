'use client'
import React, { useState } from 'react'
import '../stylesheets/register.css'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [authenticationError, setAuthenticationError] = useState(false)

  const handleLogin = async(e) => {   
    e.preventDefault(); 
    try {      
      const response = await axios.post('http://localhost:8080/login', {
          username,
          password
      });
      console.log(response)
      const token = response.data.token;
      console.log(token)
      if(token) {
        document.cookie = `token=${token};path=/`;
        axios.defaults.headers.common['Authorization'] = `${token}`;
        // localStorage.setItem('token', token)
        router.push('/feed');
      }
      else {
        console.error('Token not found in the server response');        
      }
      console.log(response.data); // Display success message or handle accordingly
      
      // router.push('../profile')
    } catch (error) {
      setAuthenticationError(true);
      console.error('Login failed', error);
    }
  }


  return (
    <div className='main'>
        <div className="container">
          <div className="main-register">
            <h1>Snaptacle</h1>
            <input type="text" placeholder='Username' name='username' onChange={e => setUsername(e.target.value)}/>
            <input type="password" placeholder='Password' name='password' onChange={e => setPassword(e.target.value)}/>
            { authenticationError &&
              <p className='login-failed'>Username or password is incorrect</p>
            }
            <button onClick={handleLogin}>Log in</button>
            <p>Not have an account? <Link className='highlight' href='/register'>Sign up</Link> </p>
          </div>
        </div>
    </div>
  )
}
export default Login