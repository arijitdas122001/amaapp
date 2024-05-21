'use client'

import { acceptMessageSchema } from "@/schema/acceptmessageSchema";
import axios, { AxiosError } from "axios";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { Message } from "@/model/User";
const DashBoard = () => {
  const [ProcessStart,SetProcessStart]=useState(false); 
  const [Messages,SetMessages]=useState<Message[]>([]);
  const [Loading,SetLoading]=useState(false);
  const form=useForm({
    resolver:zodResolver(acceptMessageSchema)
  });
  const {
    watch,
    setValue
  }=form;
  const acceptMessage=watch('acceptMessages');
  const fetchMessages=useCallback(async()=>{
    try {
    SetLoading(true);
    const res=await axios.get<ApiResponse>('/api/get-messages');
    SetMessages(res.data.messages || []);
    }catch(error:any){
      const axioserror=error as AxiosError<ApiResponse>;
      toast({
        title:"Can noy Get the Messages",
        description:axioserror.response?.data.message ?? "Failed to fetch messages",
        variant:"destructive",    
      })
    }
    finally{
      SetLoading(false);
    }
  },[SetMessages])
  return (
    <div>
      
    </div>
  )
}

export default DashBoard
