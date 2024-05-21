import { DbConnection } from "@/lib/dbConnection";
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import apiResponse from "@/utils/apiResponse";
import UserModel from "@/model/User";

export async function GET(request:Request) {
    await DbConnection();
        const session=await getServerSession(authOptions);
        const user=session?.user;
        console.log(user);
        if(!session && !user){
            return apiResponse(false,"Not authintacated",401)
        }
        const user_id=new mongoose.Types.ObjectId(user?._id);
        try {
            const messages=await UserModel.aggregate([
                {$match:{_id:user_id}},
                {$unwind:{
                    path:"$messages"
                }},
                {$sort:{'messages.createdAt':-1}},
                {$group:{_id:'$_id',messages:{$push:"$messages"}}}
            ]).exec();
            if(!messages){
                return apiResponse(false,"User Not found in get-messages",401);
            }
            return apiResponse(true,messages[0].messages,200);
        } catch (error) {
            return apiResponse(false,"Error while getting messasges",401)
        }
};