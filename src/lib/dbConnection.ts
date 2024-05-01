import mongoose, { mongo } from 'mongoose';
type connectionObjec={
    isConnected?:number
}
const Connection : connectionObjec ={};
export const DbConnection=async():Promise<void>=>{
    if(Connection.isConnected){
        console.log("Db already connected");
        return;
    }
    try {
        const db=await mongoose.connect(process.env.MONGO_URL!);
        Connection.isConnected=db.connections[0].readyState;
        console.log("Database connected");
    } catch (error) {
        console.log("Db connection Failed ",error);
        process.exit(1);
        
    }
}   