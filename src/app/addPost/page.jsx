'use client'
import React, { useEffect, useState } from 'react'
import TitleBar from '../components/TitleBar'
import NavBar from '../components/NavBar'
import '../stylesheets/addPost.css'
import { RiAddLine } from "@remixicon/react";
import { useRouter } from 'next/navigation';
import axios from 'axios'
import Cookies from 'js-cookie'
const apiurl = process.env.NEXT_PUBLIC_APIURL;


const AddPost = () => {
  const router = useRouter();
  const [caption, setCaption] = useState();

  const [file, setFile] = useState();
  const [previewImage, setPreviewImage] = useState(null);

  const [tagString, setTagString] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleImgChange = async(e) => {
    const selectFile = e.target.files[0];
    setFile(e.target.files[0]);
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
    setLoading(true);
    const formData = new FormData();
    console.log('String: ', tagString)
    formData.append('image', file);
    const tags = tagString.split(' ');
    console.log('Tags: ', tags)
    try {
      const response = await axios.post(`${apiurl}/upload`, {file, caption, tags, authorization: Cookies.get('token')} ,{
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
      setLoading(false);
    } catch (error) {
      setLoading(false)
      console.error('Error uploading file:', error);
    }
  }

  return (
    <div className="main">
      <div className="container">
      <div className="add-post">
        <TitleBar title='Add Post'></TitleBar>
        <div className="add-post-area">          
          <div className="img-selector" onClick={handleFormClick} style={{ backgroundImage: `url(${previewImage})`}} >
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
          <textarea name="" rows='5' placeholder='Write a capiton' id="" onChange={e => setCaption(e.target.value)}></textarea>
          <textarea type="text" rows='2' placeholder='Enter hastags' onChange={e => setTagString(e.target.value.toLowerCase())}></textarea>
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
  );
}

export default AddPost