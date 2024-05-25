import { DbConnection } from "@/lib/dbConnection"
import UserModel from "@/model/User";
import apiResponse from "@/utils/apiResponse";
import { NextRequest} from "next/server"

export async function POST(request:NextRequest) {
    await DbConnection();
    try {
        const {user_id,message_id}=await request.json();
        const Message_Deletion=await UserModel.updateOne(
            {_id:user_id},
            {$pull:{messages:{_id:message_id}}},
        );
        if(!Message_Deletion){
            return apiResponse(false,"Unable to delete the message",401);   
        }
        return apiResponse(true,"Deleted the message",200);
    } catch (error) {
        return apiResponse(false,"Error while deleting the message",400);
    }
}
