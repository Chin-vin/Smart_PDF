import React from 'react'
import Sidebar from './_components/Sidebar'

function  DashboardLayout({children}) {
  return (
    <div className='flex gap-2 justify-between'>
        <div className=' md:w-64 h-screen fixed'>
            <Sidebar />
        </div>

        <div className='md:ml-64'>
            {children}
        </div>

    </div>
  )
}

export default  DashboardLayout;