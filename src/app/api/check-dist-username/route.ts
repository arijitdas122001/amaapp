import { DbConnection } from "@/lib/dbConnection";
import UserModel from "@/model/User";
import { NextRequest } from "next/server";
import { z } from "zod"
const UserNameValidation=z
.string()
.min(2, 'Username must be at least 2 characters')
.max(20, 'Username must be no more than 20 characters')
.regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters');
const UserNameSchema=z.object({
    username:UserNameValidation
});
export async  function GET(request:NextRequest){
    await DbConnection();
    try {
        const {searchParams}=new URL(request.url);
        const queryParams={
            username:searchParams.get('username'),
        }
        const isUnique=UserNameSchema.safeParse(queryParams);
        // console.log(isUnique);
        if(!isUnique.success){
            const userNameErrors=isUnique.error.format().username?._errors || [];
            return Response.json(
                {
                  success: false,
                  message:
                    userNameErrors?.length > 0
                      ? userNameErrors.join(', ')
                      : 'Invalid query parameters',
                },
                { status: 400}
              );
        }
        const {username}=isUnique.data;
        const existingUser=UserModel.findOne({
            username,
            isVerified:true                                                                                                                                                                                                                                                                                
        });
        if(!existingUser){
            return Response.json(
                {
                  success: false,
                  message:"username already exists"
                },
                { status: 200 }
              );
        }
        return Response.json(
            {
              success: true,
              message:"user name is unique"
            },
            { status: 200 }
          );
    } catch (error) {
        return Response.json({
            success:false,
            messagee:"Error while signing in the user"
        },{status:500});
    }

}