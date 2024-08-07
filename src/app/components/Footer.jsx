import React from 'react'
import Image from "next/image";


function Footer() {
  return (
    <footer className="bg-gray-50 fixed bottom-0 w-full">
    <div className="mx-auto max-w-screen-xl px-2 py-2 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
        <div className="flex justify-center text-teal-600 sm:justify-start">
                <Image 
            src={'./logo.svg'}
            alt='logo'
            width={100}
            height={80}
            />
        </div>

        <p className="mt-4 text-center text-sm text-gray-500 lg:mt-0 lg:text-right">
            Copyright &copy; 2024 Workspace-Loop
        </p>
        </div>
    </div>
    </footer>
  )
}

export default Footer
