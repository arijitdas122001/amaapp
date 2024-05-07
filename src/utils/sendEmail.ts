import { ApiResponse } from "@/types/apiresponse";
import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/email-component";
export const SendEmail=async(
username:string,
email:string,
verificationCode:string):Promise<ApiResponse>=>{
    try {
        const data = await resend.emails.send({
            from: 'arijitd1211@gmail.com',
            to:email,
            subject: 'Verificaton Email',
            react: VerificationEmail({ username:username,verificationCode:verificationCode }),
          });
        return {success:true,message:"Successfully Sent the mail"}
    } catch (error) {
        console.log('There is an error sending an email',error);
        return {success:false,message:"Error Sending email"}
    }
}