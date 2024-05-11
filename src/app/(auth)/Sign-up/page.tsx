'use client'
import { SignInSchema } from '@/schema/SignInSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDebounceValue } from 'usehooks-ts'
import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import z from 'zod'
import axios,{AxiosError} from 'axios'
import { SignUpSchema } from '@/schema/SignUpSchema'
import { ApiResponse } from '@/types/apiresponse'
import { useToast } from '@/components/ui/use-toast'
import { Form, FormControl,FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/router'
const page = () => {
  const [Username,setUsername]=useState('');
  const [debouncedValue, setValue] = useDebounceValue(Username, 500);
  const [checkingUsername,setCheckingUsername]=useState(false);
  const [onSubmitting,setOnSubmitting]=useState(false);
  const [UseNamecheckingMessage,setUseNamecheckingMessage]=useState('');
  const [email,setEmail]=useState('');
  const [password,setpassword]=useState('');
  const {toast}=useToast();
  const route=useRouter();
  const form=useForm<z.infer<typeof SignUpSchema>>({
    resolver:zodResolver(SignInSchema),
    defaultValues:{
      username:"",
      email:"",
      password:""
    }
  });
  useEffect(()=>{
    const CheckUserName=async()=>{
      try {
        setCheckingUsername(true);
        setUsername('');
        const res=await axios.post(`${process.env.URL}/check-dist-username?username=${debouncedValue}`);
        setUseNamecheckingMessage(res.data.message)
      } catch (error) {
        const axioserror=error as AxiosError<ApiResponse>;
        setUseNamecheckingMessage(axioserror.response?.data.message ?? "error checking username");
      }
      finally{
        setCheckingUsername(false);
      }
    }
    CheckUserName()
  },[Username,debouncedValue]);
  const onSubmit=async()=>{
    try {
      setOnSubmitting(true);
      const res=await axios.post(`${process.env.URL}/sign-up`);
      toast({
        title:"success",
        description:res.data.message
      });
      route.replace('/verify');
    } catch (error) {
      const axioserror=error as AxiosError<ApiResponse>;
      toast({
        title:"failure",
        description:axioserror.response?.data.message
      })
    }finally{
      setOnSubmitting(false);
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} onChange={(e)=>{
                  field.onChange(e)
                  setUsername(e.target.value)
                }} />
              </FormControl>
            </FormItem>
          )}
        />
        {checkingUsername && <Loader2 className="animate-spin"/>}
        <p className={`text-sm ${UseNamecheckingMessage==="user name is unique"?'text-green-500':'text-red-500'}`}></p>
          <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
            <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} onChange={(e)=>{
                  field.onChange(e)
                  setEmail(e.target.value)
                }} />
              </FormControl>
            </FormItem>
          )}
        />
          <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
               <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" {...field} onChange={(e)=>{
                  field.onChange(e)
                  setpassword(e.target.value)
                }} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={onSubmitting}>
          {onSubmitting?<Loader2 className="animate-spin"/>:"Sign-Up"}
        </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default page
