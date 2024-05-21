import { DbConnection } from "@/lib/dbConnection";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs'
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
export const authOptions:NextAuthOptions={
    providers:[
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email"},
                password: { label: "Password", type: "password" }
              },
            async authorize(credentials):Promise<any>{
                await DbConnection();
                try {
                    const user=await UserModel.findOne({
                       email:credentials?.email
                    });
                    if(!user){
                        throw new Error("Can not find the user");
                    }
                    if(!user.isVerified){
                        throw new Error("user is not verified");
                    }
                    const StrPass:string=credentials?.password!;
                    const isPasswordCorrect=await bcrypt.compare(StrPass,user.password);

                    if(!isPasswordCorrect){ 
                        throw new Error("wrong credentials");
                    }
                    return user;
                } catch (error:any) {
                    throw new Error(error);
                } 
            }         
        })
    ],
    callbacks:{
        async jwt({ token ,user}) {
          if(user){
              token._id=user._id?.toString();
              token.isVerified=user.isVerified;
              token.isAcceptingMessages=user.isAcceptingMessages;
              token.username=user.username;
          }
          return token
        },
         async session({ session,token }) {
            if(token){
                session.user._id=token._id;
                session.user.isVerified=token.isVerified;
                session.user.isAcceptingMessages=token.isAcceptingMessages;
                session.user.username=token.username;

            }
            // console.log(session);
            return session;
          },
    },
    session: {
        strategy: 'jwt',
      },
      secret: process.env.NEXTAUTH_SECRET,
      pages: {
        signIn: '/sign-in',
      },
} 