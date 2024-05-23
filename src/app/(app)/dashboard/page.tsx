"use client";

import { acceptMessageSchema } from "@/schema/acceptmessageSchema";
import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, useToast } from "@/components/ui/use-toast";
import { Message } from "@/model/User";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import MessageCard from "@/components/messageCard";
const DashBoard = () => {
  const [ProcessStart, SetProcessStart] = useState(false);
  const [Messages, SetMessages] = useState<Message[]>([]);
  const [Loading, SetLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });
  const { watch, setValue,register } = form;
  const acceptMessages = watch("acceptMessages");
  const FetchMessages = async () => {
    try {
      SetLoading(true);
      const res = await axios.get<ApiResponse>("/api/get-messages");
      console.log(res.data);
      SetMessages(res.data.messages || []);
    } catch (error: any) {
      const axioserror = error as AxiosError<ApiResponse>;
      toast({
        title: "Can not Get the Messages",
        description:
          axioserror.response?.data.message ?? "Failed to fetch messages",
        variant: "destructive",
      });
    } finally {
      SetLoading(false);
    }
  };
  const ToogleAcceptMessage = async () => {
    try {
      const res = await axios.post("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: "Toogled the switch",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Network Error",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    }
  };
  const IsMessageAccepting = async () => {
    try {
      const res = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", res.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Network Error",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    }
  };
  const { data: session } = useSession();
  useEffect(() => {
    if (!session || !session?.user) return;
    FetchMessages();
    IsMessageAccepting();
  },[session]);
  const username = session?.user;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const userUrl = `${baseUrl}/u/${username}`;
  const copyToclipboard = () => {
    navigator.clipboard.writeText(userUrl);
    toast({
      title: "Copied",
      description: "Url copied successfully",
    });
  };
  const handelDeleteMessage=(id:string)=>{
    Messages.filter((ele)=>ele._id!==id);
  }
  return (
    <div>
      <h1>User Dashborad</h1>
      <div className="flex justify-around">
        <div className="left-page">
          copy your unique Link
          <Button onClick={copyToclipboard}>Copy</Button>
        </div>
        <div className="right-page">
          <div className="flex items-center space-x-2">
            <Switch id="toogle" 
            {...register('acceptMessages')}
            checked={acceptMessages}
            onCheckedChange={ToogleAcceptMessage}
             />
            <Label htmlFor="toogle">Accept Messages</Label>
          </div>
        </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Messages.length===0?
          (<h1>There are no Messages For you</h1>)
          :
        Messages.map((ele,i)=>(
          <MessageCard message={ele} OnMessageDelete={handelDeleteMessage}/>
        ))
      }
      </div>
    </div>
  );
};
export default DashBoard;
