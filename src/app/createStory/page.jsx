'use client'
import React, { useEffect, useRef, useState } from 'react'
import '../stylesheets/addPost.css'
import TitleBar from '../components/TitleBar'
import { RiAddLine } from "@remixicon/react";
import { useRouter } from 'next/navigation';
import NavBar from '../components/NavBar'
import axios from 'axios'
import Cookies from 'js-cookie'
const apiurl = process.env.NEXT_PUBLIC_APIURL;
const page = () => {

  const imgInputRef = useRef()
    const router = useRouter();
  const [caption, setCaption] = useState();

  const [file, setFile] = useState();
  const [previewImage, setPreviewImage] = useState(null);

  const [tagString, setTagString] = useState('');
  const [loading, setLoading] = useState(false);
  
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
    const imgInput = imgInputRef;
    imgInput.current.click();
  }

  const handleUploadSubmit = async() => {
    // const cookiess = document.cookie.split('=');
    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await axios.post(`${apiurl}/createStory`, {file, authorization: Cookies.get('token')} ,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },        
      });

      console.log(response)
      if (response.data.message) {
        console.log('File uploaded successfully');
        
        router.push('/feed');
        setLoading(false);
      } else {
        console.error('File upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  return (
    <div className="main">
      <div className={loading ? 'container-blur' : 'container'}>
        <div className="add-post">
            <TitleBar title='Add Story'></TitleBar>
            <div className="add-post-area add-story-area">          
            
            <div className="img-selector img-selector-story" onClick={handleFormClick} style={{ backgroundImage: `url(${previewImage})`}} >
                <input className='img-input' accept='image/*' type="file" name='file' ref={imgInputRef} onChange={handleImgChange} hidden/>
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

{
  loading && 
  <div className="uploading">
    <div><iframe src="https://giphy.com/embed/VseXvvxwowwCc"></iframe></div>
        <p>Uploading...</p>
  </div>
}
      
    </div>
  )
}

export default page