'use client'
import React, { useState, useRef } from 'react'
import '../stylesheets/otp.css'
import { useRouter } from 'next/navigation';
import axios from 'axios'
import { RiCloseFill } from "@remixicon/react";
const apiurl = process.env.NEXT_PUBLIC_APIURL;

const Otp = ({token, email, closeOtp}) => {
    const router = useRouter();
    const inputRef = useRef();
    const [isIncorrect, setIsIncorrect] = useState(false);
    const [OTP, setOTP] = useState();
    const handleVerification = async() => {
        console.log('In verification')
        try {
            const response = await axios.post(`${apiurl}/verification`, {
                OTP,
            });

            if(response.data.message) {                
                router.push('/feed');
            }
            else {
                setIsIncorrect(true);
            }
        }
        catch(err) {
            console.log('Error occur in verifying: ', err);
        }
    }
  return (
    <div className="main-otp" data-testid="main-otp">
        <div onClick={closeOtp} className='close-icon'>
                    <RiCloseFill
                        size={30} 
                        color="white" 
                        className="my-icon" 
                    /> 
                </div>
        <h1>Verify account</h1>
        <h4>OTP is sent to {email}</h4>
        <input type="text" placeholder='Enter the OTP' onChange={e => setOTP(e.target.value)} ref={inputRef}/>
        {isIncorrect &&
            <p>OTP is wrong</p>
        }        
        <button onClick={handleVerification}>Verify</button>
    </div>
  )
}

export default Otp