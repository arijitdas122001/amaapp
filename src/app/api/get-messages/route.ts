import { DbConnection } from "@/lib/dbConnection";
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import apiResponse from "@/utils/apiResponse";
import UserModel from "@/model/User";
import { json } from "stream/consumers";

export async function GET(request:Request) {
    await DbConnection();
        const session=await getServerSession(authOptions);
        // console.log(session);
        // console.log("your backend session variable ",session1);
        const _user=session?.user;
        // console.log(user);
        if(!session && !_user){
            return apiResponse(false,"Not authintacated",401)
        }
        const user_id=new mongoose.Types.ObjectId(_user?._id);
        try {
            const user_messages=await UserModel.aggregate([
                {$match:{user_id}},
                {$unwind:{
                    path:'$messages'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                }},
                {$sort:{'messages.createdAt':-1}},
                {$group:{_id:'$_id',messages:{$push:"$messages"}}}
            ]).exec();
            if(!user_messages){
                return apiResponse(false,"User Not found in get-messages",401);
            }
            // console.log(user);
            return Response.json(
                { messages: user_messages },
                {
                  status: 200,
                }
              );
        } catch (error) {
            return apiResponse(false,"Error while getting messasges",400)
        }
};