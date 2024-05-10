import mongoose ,{Schema,Document, mongo} from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
  }
  
  const MessageSchema: Schema<Message> = new mongoose.Schema({
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  });
export interface UserInterface extends Document{
    username:string,
    email:string,
    password:string,
    verificationCode:string,
    CodeExpiry:Date,
    isVerified:boolean,
    isAccepting:boolean,
    messages:Message[],
};
const UserSchema :Schema<UserInterface>=new Schema({
    username:{
        type:String,
        required:[true,"please provide username"],
        trim:true,
        unique:true,
    },
    email:{
        type:String,
        required:[true,"please provide email"],
        unique:true,
    },
    password:{
        type:String,
        required:[true,"plase provide password"],
    },
    verificationCode:{
        type:String,
        required:[true,"verification code required"],
    },
    CodeExpiry:{
        type:Date,
        required:[true,'codeExpiry is required'],
        default:Date.now(),
    },
    isVerified:{
        type:Boolean,
        required:[true,'verificaion required'],
        default:false,
    },
    isAccepting:{
        type:Boolean,
        default:true,
    },
    messages:[MessageSchema],
});
 const UserModel=mongoose.models.User as mongoose.Model<UserInterface> || mongoose.model<UserInterface>('User',UserSchema);
 export default UserModel;