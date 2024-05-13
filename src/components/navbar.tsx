'use client'
import { useSession } from 'next-auth/react'
import React from 'react'

const Navbar = () => {
    const {data:session}=useSession();
    const user=session?.user;
  return (
    <div>
      <h1>Navar</h1>
    </div>
  )
}

export default Navbar
