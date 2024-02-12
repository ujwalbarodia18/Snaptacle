'use client'
import React, { useEffect } from 'react'
import  "../stylesheets/edit-profile.css";
import { useState } from "react";
import TitleBar from '../components/TitleBar'
import Navbar from "../components/NavBar";
import { RiAddLine } from "@remixicon/react";
import axios from 'axios'
import { useRouter } from 'next/navigation'
// import './stylesheets/navbar.css'

const page = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
  
    const [file, setFile] = useState();
    const [previewImage, setPreviewImage] = useState(null);
  
    const handleImgChange = async(e) => {
      const selectFile = e.target.files[0];
      await setFile(e.target.files[0]);
      // const imgSelector = document.querySelector('.img-selector');
      console.log('Click')
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        console.log('In onload')
      };
      if (selectFile) {
        console.log('In file')
        reader.readAsDataURL(selectFile);
      }
      console.log(file)
    }
  
    const handleFormClick = () => {
      const imgInput = document.querySelector('.img-input');
      imgInput.click();
    }

    const handleUploadSubmit = async() => {
        const cookiess = document.cookie.split('=');
        const formData = new FormData();
        formData.append('image', file);
    
        try {
          const response = await axios.post('http://localhost:8080/editProfile', {file, name, bio, authorization: cookiess[1]} ,{
            headers: {
              'Content-Type': 'multipart/form-data',
            },        
          });
    
          console.log(response)
          if (response.data.message) {
            console.log('File uploaded successfully');
            router.push('/profile');
          } else {
            console.error('File upload failed');
          }
        } catch (error) {
          console.error('Error uploading file:', error);
        }
    }
  
    return (    
      <main className='edit-main'>
        <div className='edit-container'>
          <TitleBar title='Edit Profile' />
          <div className="edit-profile-container">
            <div className="edit-profile-img" onClick={handleFormClick} style={{ backgroundImage: `url(${previewImage})`}}>
              <input className='img-input' accept='image/*' type="file" name='file' onChange={handleImgChange} hidden/>
                {
                    !previewImage &&
                    <RiAddLine
                    size={100} // set custom `width` and `height`
                    color="white" // set `fill` color
                    className="my-icon" // add custom class name
                  />
                }
            </div>
  
            <div className="edit-update-info">
              <input type="text" placeholder="Name" onChange={e => setName(e.target.value)}/>
              <input type="text" placeholder="Bio" onChange={e => setBio(e.target.value)} />
              <button onClick={handleUploadSubmit}>Save</button>
            </div>
          </div>
          <Navbar selected={10}/>
        </div>
      </main>
    )
}

export default page