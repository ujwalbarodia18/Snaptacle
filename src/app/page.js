'use client'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import './page.css'
export default function Home() {
  const router = useRouter();
  const handleHome = () => {
    if(document.cookie) {
      router.push('/feed');
    }
    else {
      router.push('/login');
    }
  }

  useEffect(() => {
    handleHome();
  })

  return (    
    <main className='saved-main'>
        
    </main>
  );
}
