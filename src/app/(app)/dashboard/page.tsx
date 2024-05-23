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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel" 
import MessageCard from "@/components/messageCard";
import { isAscii } from "buffer";
const DashBoard = () => {
  const [ProcessStart, SetProcessStart] = useState(false);
  const [Messages, SetMessages] = useState<Message[]>([]);
  const [Loading, SetLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });
  const { watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");
  const FetchMessages = async () => {
    try {
      SetLoading(true);
      const res = await axios.get<ApiResponse>("/api/get-messages");
      console.log(res.data.messages);
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
  },[]);
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
      <div className="top-page">
        <div className="left-page">
          copy your unique Link
          <Button onClick={copyToclipboard}>Copy</Button>
        </div>
        <div className="right-page">
          <div className="flex items-center space-x-2">
            <Switch id="toogle" />
            <Label htmlFor="toogle">Accept Messages</Label>
          </div>
        </div>
        <div className="cards">
        <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {Messages.map((ele,i)=>(
          <CarouselItem key={i}>
            <div className="p-1">
              <MessageCard message={ele} OnMessageDelete={handelDeleteMessage}/>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
        </div>
      </div>
    </div>
  );
};
export default DashBoard;
