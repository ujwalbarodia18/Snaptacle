'use client'
import React, { useState } from 'react'
import '../stylesheets/register.css'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Router from 'next/router';
import Link from 'next/link';

const Register = () => {
  const router = useRouter();
  const [name, setName] = useState();
  const [password, setPassword] = useState();
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [authenticationError, setAuthenticationError] = useState(false)
  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:8080/register', {
          name,
          username,
          email,
          password
      });

      const token = response.data.token;
      console.log(token)
      if(token) {
        document.cookie = `token=${token};path=/`;
        // axios.defaults.headers.common['Authorization'] = `${token}`;
        // // localStorage.setItem('token', token)
        router.push('/feed');
      }
      else {
        console.error('Token not found in the server response');
      }

      console.log(response.data); // Display success message or handle accordingly
      // console.log(router.push)
      // router.push('/feed');
      // router.push('../profile')
    } catch (error) {
      setAuthenticationError(true)
      console.error('Registration failed', error);
    }
  }
  return (
    <div className="main">
      <div className="container">
        <div className='main-register'>
            <h1>Snaptacle</h1>
            <input type="text" placeholder='Name' name='name' onChange={e => setName(e.target.value)} required/>
            <input type="text" placeholder='Username' name='username' onChange={e => setUsername(e.target.value)} required/>
            <input type="text" placeholder='Email' name='email' onChange={e => setEmail(e.target.value)} required/>
            <input type="password" placeholder='Password' name='password' onChange={e => setPassword(e.target.value)} required/>
            { authenticationError &&
              <p className='login-failed'>Credential is not correct!</p>
            }
            <button onClick={handleRegister}>Sign up</button>
            <p>Already have an account? <Link className='highlight' href='/login'>Sign in</Link> </p>
        </div>
      </div>
    </div>
  )
}

export default Register