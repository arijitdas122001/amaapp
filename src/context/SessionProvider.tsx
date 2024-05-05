'use client'
import { SessionProvider } from "next-auth/react"
export default function Provider({
  children
}:{
    // It says the return type will be reactNode type
    children:React.ReactNode
}) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}