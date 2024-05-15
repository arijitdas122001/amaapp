'use client'
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Message } from '@/model/User'
import { Button } from './ui/button'
type parameterType={
    message:Message,
    OnMessageDelete:(mid:string)=>void;
}
const MessageCard = ({message,OnMessageDelete}:parameterType) => {
    //call an axios
    const DeleteCard=()=>{
        OnMessageDelete(message._id);
    }
  return (
    <div>
      <Card>
  <CardHeader>  
    <CardTitle></CardTitle>
    <CardDescription></CardDescription>
  </CardHeader>
  <CardContent>
    <p>{message.content}</p>
  </CardContent>
  <CardFooter><AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={()=>DeleteCard}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </CardFooter>
</Card>
    </div>
  )
}

export default MessageCard
