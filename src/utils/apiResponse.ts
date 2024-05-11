import { NextResponse } from "next/server";

const apiResponse=(success:boolean,message:string,status:any)=>{
    return NextResponse.json({
        success:success,
        messagee:message
    },{status:status});
}
export default apiResponse;