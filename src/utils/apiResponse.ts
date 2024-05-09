const apiResponse=(success:boolean,message:string,status:any)=>{
    return Response.json({
        success:success,
        messagee:message
    },{status:status});
}
export default apiResponse;