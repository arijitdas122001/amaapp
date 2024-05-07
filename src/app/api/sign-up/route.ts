import { NextRequest,NextResponse } from "next/server";
import { SendEmail } from "@/utils/sendEmail";
import { DbConnection } from "@/lib/dbConnection";
import bcrypt from 'bcryptjs';
import UserModel from "@/model/User";
export async function POST(request:NextRequest){
   await DbConnection();
    try {   
        const {username,email,password}=await request.json();
        const findUser=await UserModel.findOne({email,isVerified:true});
        // if both email found and also verified
       if(findUser){
        return Response.json({
            success:false,
            messagee:"User and email already verified and exists"
        },{status:400});
       }
       const exsistingUser=await UserModel.findOne({email});
       const verificationCode=Math.floor(100000+Math.random()*900000).toString();
       const veficationExpiry=Date.now()+36000;

       //if user with the email is found
       if(exsistingUser){
        // if the user is not verified
        if(!exsistingUser.isVerified){
            const hashPassword=await bcrypt.hash(password,10);
            exsistingUser.password=hashPassword;
            exsistingUser.email=email;
            exsistingUser.verificationCode=verificationCode;
            exsistingUser.isVerified=true;
            exsistingUser.CodeExpiry=new Date(veficationExpiry);
            await exsistingUser.save();
        }
        // if user doesn't exist make one
       }else{
        const hashPassword=await bcrypt.hash(password,10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);
        const UserBody=new UserModel({
        username,
        email,
        password:hashPassword,
        verificationCode:verificationCode,
        CodeExpiry:expiryDate,
        isVerified:false,
        isAccepting:true,
        messages:[],
        });
        await UserBody.save();
       }
       const emailResponse=await SendEmail(username,email,verificationCode);
    //    if the email response is not sucessfull
       if(!emailResponse.success){
        return Response.json({
            success:false,
            message:"Sending Mail failure",
        },{status:500});
       }
    //    console.log(emailResponse);
       return Response.json({
        success:true,
        messagee:"User registerd successfully and sent the verification email"
    },{status:201});
    } catch (error) {
        return Response.json({
            success:false,
            messagee:"Error while creating the user"
        },{status:500});
    }
}