"use client"; 
import React from 'react'; 
import Image from 'next/image'; 
import { useUser, UserButton } from '@clerk/nextjs'; 

function Header() { 
  const { isLoaded, isSignedIn, user } = useUser(); 

  return ( 
    <header className="w-full px-8 py-4 shadow-md bg-white dark:bg-gray-900 flex items-center justify-between flex-wrap sm:px-6"> 
      {/* Left: Logo + Project Name */} 
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start mb-4 sm:mb-0"> 
        <Image src="/logo.svg" alt="Logo" width={40} height={40} /> 
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">AI PDF Viewer</h1> 
      </div> 

      {/* Right: User Info */} 
      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end"> 
        {isLoaded && isSignedIn ? ( 
          <> 
            <UserButton afterSignOutUrl="/" /> 
          </> 
        ) : ( 
          <span className="text-sm text-gray-500 dark:text-gray-300">Loading...</span> 
        )} 
      </div> 
    </header> 
  ); 
} 

export default Header;
