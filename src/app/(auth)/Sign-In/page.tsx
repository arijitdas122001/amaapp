'use client'
import {useToast } from "@/components/ui/use-toast";
import { SignInSchema } from "@/schema/SignInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl,FormField, FormItem, FormLabel,} from '@/components/ui/form'
import z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
const Signin = () => {
  const { toast } = useToast();
  const route = useRouter();
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
    // console.log(data.email);
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    if (result?.error) {
        if (result.error === 'wrong credentials') {
          toast({
            title: 'Login Failed',
            description: 'Incorrect username or password',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error',
            description: result.error,
            variant: 'destructive',
          });
        }
      }
  
      if (result?.url) {
        route.replace('/dashboard');
      }
  };
  return ( <div className="flex justify-center items-center min-h-screen bg-gray-800">
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
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder="Email"  {...field} onChange={(e)=>{
              field.onChange(e)
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
            }} />
          </FormControl>
        </FormItem>
      )}
    />
    <Button type="submit">
      Sign-In
    </Button>
      </form>
    </Form>
  </div>
</div>);
};

export default Signin;
