'use client'
import { signOut, useSession } from 'next-auth/react'
import React from 'react'
import { Button } from './ui/button';
import Link from 'next/link';

const Navbar = () => {
    const {data:session}=useSession();
    const user=session?.user;
  return (
    <nav className="m-6">
      <div className="flex justify-between p-6 w-70 bg-gray-300 rounded-xl align-middle">
      <div className='text-xl font-bold'>Mystry Message</div>
      <div>
        {
          session?(
            <div className="flex gap-2 align-middle justify-center">
            <span className="text-lg">
              Welcome, {user?.username || user?.email}
            </span>
            <Button onClick={()=>signOut()}>Logout</Button>
            </div>
          ):(
        <Link href="/Sign-In">
        <Button>LogIn</Button>
        </Link>
          )
        }
      </div>
      </div>
    </nav>
  )
}

export default Navbar
