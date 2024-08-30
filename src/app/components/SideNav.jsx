'use client'
import React, { useEffect } from 'react'
import Image from 'next/image'
import { CircleUserRound, DeleteIcon, LayoutGrid, Search, ShieldPlus, Trash2 } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Divider } from '@mui/material';

function SideNav() {
  const router = useRouter();

  const menuList= [
    {
      id:1,
      name:'Dashboard',
      icon: LayoutGrid,
      path: '/dashboard'
    },
    {
      id:2,
      name:'New Incident',
      icon: ShieldPlus,
      path: '/dashboard/newIncident'
    },
    {
      id:3,
      name:'Search',
      icon: Search,
      path: '/dashboard/search'
    },
  ]

  const path = usePathname();

  useEffect(()=>{
    console.log(path);
  }, [path])

  return (
    <div className='h-screen p-5 border shadow-sm '>
      <Image src={'/logo.svg'} 
      alt='logo'
      width={160}
      height={100}
      />

      <div className='mt-5'>
        {menuList.map(menu =>(
          <Link href={menu.path} key={menu.id}>
          <h2 className={`flex gap-2 items-center text-gray-500 font-medium p-5 cursor-pointer rounded-md hover:text-primary hover:bg-blue-50
          ${path==menu.path && 'text-primary bg-blue-50'}
          `}>
            <menu.icon />
            {menu.name}
          </h2>
          </Link>
        ))}
      </div>
      <div className='fixed bottom-10 p-5 flex gap-2 items-center'>
        <Button 
        type="submit"
        variant="contained"
        color="primary"
        sx={{
          width: '150px',
          mt: 2,
          mb: 2,
          backgroundColor: "#12a1c0",
          color: "#fff",
          '&:hover': {
              backgroundColor: '#0F839D',
              }, 
        }}
        startIcon={<Trash2 />}
        onClick={() => router.push('/dashboard/bin')} 
        >Bin</Button>
      </div>
    </div>
  )
}

export default SideNav
