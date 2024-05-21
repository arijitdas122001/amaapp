'use client'

import { acceptMessageSchema } from "@/schema/acceptmessageSchema";
import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, useToast } from "@/components/ui/use-toast";
import { Message } from "@/model/User";
import { useSession } from "next-auth/react";
const DashBoard = () => {
  const [ProcessStart,SetProcessStart]=useState(false); 
  const [Messages,SetMessages]=useState<Message[]>([]);
  const [Loading,SetLoading]=useState(false);
  const {toast}=useToast();
  const form=useForm({
    resolver:zodResolver(acceptMessageSchema)
  });
  const {
    watch,
    setValue
  }=form;
  const acceptMessages=watch('acceptMessages');
  const FetchMessages=useCallback(async()=>{
    try {
    SetLoading(true);
    const res=await axios.get<ApiResponse>('/api/get-messages');
    SetMessages(res.data.messages || []);
    }catch(error:any){
      const axioserror=error as AxiosError<ApiResponse>;
      toast({
        title:"Can not Get the Messages",
        description:axioserror.response?.data.message ?? "Failed to fetch messages",
        variant:"destructive",    
      })
    }
    finally{
      SetLoading(false);
    }
  },[SetMessages]);
  const ToogleAcceptMessage=async()=>{
    try {
      const res=await axios.post('/api/accept-messages',{
        acceptMessages: !acceptMessages
      });
      setValue("acceptMessages",!acceptMessages);
      toast({
        title:"Toogled the switch"
      })
    } catch (error) {
       const axiosError=error as AxiosError<ApiResponse>
       toast({
        title:"Network Error",
        description:axiosError.response?.data.message,
        variant:"destructive"
       })
    }
  }
  const IsMessageAccepting=async()=>{
    try {
      const res=await axios.get<ApiResponse>('/api/accept-messages');
      setValue("acceptMessages",res.data.isAcceptingMessages);
    } catch (error) {
      const axiosError=error as AxiosError<ApiResponse>
       toast({
        title:"Network Error",
        description:axiosError.response?.data.message,
        variant:"destructive"
       })
    }
  }
  const {data:session}=useSession();
  useEffect(()=>{
    if(!session || !session?.user)return;
      FetchMessages();
      IsMessageAccepting();
  },[session,IsMessageAccepting,FetchMessages,toast])
  return (
    <div>
      
    </div>
  )
}
export default DashBoard;
