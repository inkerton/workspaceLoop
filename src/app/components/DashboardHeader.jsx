'use client'
import { CircleUserRound } from 'lucide-react'
import React, { useState } from 'react'
import { useSession, signIn, signOut, getSession } from "next-auth/react"
import { Button } from '@mui/material'
import Cookies from 'js-cookie';

function DashboardHeader() {
  const [cookieValue, setCookieValue] = useState('');
  // const username = cookies().get('username');
  const handleGetCookie = () => {
    const cookie = Cookies.get('username');
    setCookieValue(cookie || 'No cookie found');
  };
  console.log('user is on the board: ',cookieValue)

  const handleLogout = () => {
    Cookies.remove('username');
    setCookieValue('');
  }

  return (
    <div className='p-5 shadow-sm border-b flex justify-between'>
      <div>
        Workspace-Loop
      </div>
      <div>
      <button onClick={handleGetCookie}>Get Cookie</button>
        <CircleUserRound />
        <Button onClick={handleLogout}>LogOut</Button>
      </div>
    </div>
  )
}

export default DashboardHeader
