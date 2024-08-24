import React from 'react'
import SideNav from '../../components/SideNav';
import DashboardHeader from '../../components/DashboardHeader';
import ToastContainerWrapper from '@/app/components/ToastContainerWrapper';
import CookieWrapper from '@/app/components/CookieWrapper';

function DashboardLayout({children}) {
  return (
    <div>
        <div className='fixed md:w-64 hidden md:block'>
            <SideNav />
        </div>
        <div className='md:ml-64'>
          <DashboardHeader />
        {/* {children} */}
        <CookieWrapper>
          {children}
        </CookieWrapper>
        </div>
        <ToastContainerWrapper />
    </div>
  )
}

export default DashboardLayout;
