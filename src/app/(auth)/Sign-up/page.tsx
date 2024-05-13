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
import { Form, FormControl,FormField, FormItem, FormLabel,  } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
const page = () => {
  const [Username,setUsername]=useState('');
  const [debouncedValue, setValue] = useDebounceValue('', 500);
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
        // console.log(Username);
        const res=await axios.get(`/api/check-dist-username?username=${debouncedValue}`);
        // console.log(res.data.message);
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
  },[debouncedValue]);
  const onSubmit=async(data :z.infer<typeof SignUpSchema>)=>{
    try {
      setOnSubmitting(true);
      console.log(Username);
      console.log(data);
      const res=await axios.post('/api/sign-up',data);
      toast({
        title:"Success",
        description:res.data.message
      });
      route.replace(`/verify/${Username}`);
    } catch (error:any) {
      const axioserror=error as AxiosError<ApiResponse>;
      let errorMessage = axioserror.response?.data.message;
      ('There was a problem with your sign-up. Please try again.');
      toast({
        title:"Failure",
        description:errorMessage,
        variant:'destructive'
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
                  setValue(e.target.value)
                  setUsername(e.target.value) 
                }} />
              </FormControl>
            </FormItem>
          )}
        />
        {checkingUsername && <Loader2 className="animate-spin"/>}
        <p className={`text-sm ${UseNamecheckingMessage==="user name is unique"?'text-green-500':'text-red-500'}`}>{UseNamecheckingMessage}</p>
          <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
            <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field}  onChange={(e)=>{
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
                <Input placeholder="Password" {...field} type='password' onChange={(e)=>{
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
