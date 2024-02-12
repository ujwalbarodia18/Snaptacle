'use client'
import React, { useEffect, useState } from 'react'
import '../stylesheets/addPost.css'
import TitleBar from '../components/TitleBar'
import { RiAddLine } from "@remixicon/react";
import { useRouter } from 'next/navigation'
import NavBar from '../components/NavBar'
import axios from 'axios'

const page = () => {

    const router = useRouter();
  const [caption, setCaption] = useState();

  const [file, setFile] = useState();
  const [previewImage, setPreviewImage] = useState(null);

  const [tagString, setTagString] = useState('');
  
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
      const response = await axios.post('http://localhost:8080/createStory', {file, authorization: cookiess[1]} ,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },        
      });

      console.log(response)
      if (response.data.message) {
        console.log('File uploaded successfully');
        router.push('/feed');
      } else {
        console.error('File upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  return (
    <div className="main">
      <div className="container">
        <div className="add-post">
            <TitleBar title='Add Post'></TitleBar>
            <div className="add-post-area add-story-area">          
            
            <div className="img-selector img-selector-story" onClick={handleFormClick} style={{ backgroundImage: `url(${previewImage})`}} >
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

            <button onClick={handleUploadSubmit}>Post</button>
            </div>
            <NavBar selected={3}></NavBar>
        </div>
      </div>
    </div>
  )
}

export default page