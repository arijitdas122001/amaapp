import { DbConnection } from "@/lib/dbConnection";
import UserModel from "@/model/User";
import { NextRequest } from "next/server";

export async function GET(request:NextRequest) {
    await DbConnection();
    try {
        const {username,email,code}=await request.json();
        const PresentUser=await UserModel.findOne({username});
        if(!PresentUser){
            return Response.json({
                success:false,
                messagee:"User is not present"
            },{status:400});
        }
        const checkExpiry=new Date(PresentUser?.CodeExpiry)>new Date();
        const isCodeValid=PresentUser?.verificationCode===code;
        if(checkExpiry && isCodeValid){
            PresentUser.isVerified=true;
            await PresentUser.save();
            return Response.json(
                {
                  success: true,
                  message:"user verified successfully"
                },
                { status: 200 }
              );
        }
        else if(!checkExpiry){
            return Response.json(
            {
              success: false,
              message:"verification code expired"
            },
            { status: 400 }
          );
        }
        return Response.json(
            {
              success: false,
              message:"Invalid verification code"
            },
            { status: 400 }
          );
    } catch (error) {
        return Response.json({
            success:false,
            messagee:"Error while verifying the code"
        },{status:500});
    }
}