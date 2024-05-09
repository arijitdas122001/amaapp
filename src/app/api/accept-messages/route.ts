import { DbConnection } from "@/lib/dbConnection";
import { NextRequest } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import apiResponse from "@/utils/apiResponse";
import UserModel from "@/model/User";
export async function POST(request:NextRequest) {
    await DbConnection();
    const session =await getServerSession(authOptions);
    const user=session?.user;
    if(!session && !user){
        return apiResponse(false,"User not authenticated",401);
    }
    const user_id=user?._id;
    const {acceptMessages}=await request.json();
    try {
        const updatedUser=UserModel.findByIdAndUpdate(
            user_id,
            {isAccepting:acceptMessages},
            {new:true}
        );
        if(!updatedUser){
            return apiResponse(false,"Error While updatng the user",401);
        }
        return apiResponse(true,"Updated the user accepting messages",200);
    } catch (error) {
        return apiResponse(false,"Error while updatin toogle",400);
    }

}
export async function GET(request:NextRequest) {
    await DbConnection();
    const session =await getServerSession(authOptions);
    const user=session?.user;
    if(!session && !user){
        return apiResponse(false,"User not authenticated",401);
    }
    const user_id=user?._id;
    try {
        const user=await UserModel.findById(user_id);
        if(!user){
            return apiResponse(false,"User Not found while toggle",400);
        }
        const Accepting=user.isAccepting;
        if(!Accepting){
            return apiResponse(true,"User Not accepting messages",200);
        }
        return apiResponse(true,"user accepting messages",200);
    } catch (error) {
        return apiResponse(false,"Error while gettig toogle ",400);
    }
}