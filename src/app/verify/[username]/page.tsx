'use client'
import { Button } from '@/components/ui/button';
import { Form, FormControl,FormField, FormItem, FormLabel,} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { VerifySchema } from '@/schema/verfiySchema';
import { ApiResponse } from '@/types/apiresponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import {useForm } from 'react-hook-form';
import z from "zod";
const Verify = () => {
  const [OTP,setOTP]=useState('');
  const [ProcessStarting,setProcessStarting]=useState(false);
  const params=useParams();
  const {toast}=useToast();
  const route=useRouter();
  const form=useForm<z.infer<typeof VerifySchema>>({
    resolver:zodResolver(VerifySchema),
    defaultValues:{
      verificationCode:""
    }
  });
  const onSubmit=async()=>{
    try {
      setProcessStarting(true);
      const data={
        "username":params.username,
        "code":OTP,
      }
      const res=await axios.post('/api/verify',data);
      toast({
        title:"Success",
        description:res.data?.message
      })
      route.replace('/');
    } catch (error) {
      const axiosError=error as AxiosError<ApiResponse>
      const errorMessage=axiosError.response?.data.message
      toast({
        title:"Failure",
        description:errorMessage,
        variant:'destructive'
      })
    }finally{
      setProcessStarting(false);
    }
  }
  return (
    <div className="flex justify-center align-middle items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Verify yourself</h1>
        </div>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="verificationCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your code" {...field} 
                onChange={(e)=>{
                  field.onChange(e)
                  setOTP(e.target.value)
                }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={ProcessStarting}>{ProcessStarting?<Loader2 className="animate-spin"/>:"Submit"}</Button>
      </form>
    </Form>
    </div>
    </div>
  )
}

export default Verify
