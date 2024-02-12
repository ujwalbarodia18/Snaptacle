'use client'
// import '../../../stylesheets/story.css'
import { RiCloseFill } from "@remixicon/react";
import React, { useEffect, useState } from 'react'
import ProfileImg from '@/app/components/ProfileImg'
import axios from 'axios'
import { useRouter } from 'next/navigation';
import Story from '../../components/Story'


const page = ({params}) => {
  const router = useRouter();
  const cookiess = document.cookie.split('=');
  const [stories, setStories] = useState();
  const [idx, setIdx] = useState(0);
  // const [vis, setVis] = useState(false);
  const [size, setSize] = useState();
  const getStories = async() => {
    try {
      const response = await axios.post(`http://localhost:8080/getStories/${params.userid}`, {
        authorization: cookiess[1]
      });
      console.log('Get Story:', response.data)
      setStories(response.data.stories);
      setSize(response.data.stories.stories.length);
      // router.push
    }
    catch(err) {
      console.log('Error in getStories: ', err)
    }    
  }

  useEffect(() => {    
    console.log('Re');
    // setIdx(0);
    getStories();
  }, [])

  // if(!vis) {
    
  // }

  // let interval = null;
  // useEffect(() => {
  //   if(idx == size) {          
  //     console.log('Done');
  //     // clearInterval(interval);  
  //     router.push('/feed');
  //   }  
  // }, [idx])

  // useEffect(() => {
  //   console.log(size[0])
  // }, [size])

  const routeToFeed = () => {
    router.push('/feed')
  }

  const handleChange = () => {    
    if(idx == size-1) {    
      routeToFeed();
    }
    else {
      setIdx(idx+1)
    } 
      return;   
  }
  let interval;
  // useEffect(() => {
  //   interval = setInterval(() => {
  //     if(idx >= size - 1) {
  //       router.push('/feed')
  //     }
  //     setIdx(idx+1);      
  //   }, 2000)
  // }, [idx])

  return ( 
      <div onClick={handleChange} style={{height: '100%'}}>
        {
          idx < size &&
          <Story story={stories?.stories[idx]} interval={interval} />       
        }
        
      </div>
  )
}

export default page