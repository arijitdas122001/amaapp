import { DbConnection } from '@/lib/dbConnection';
import UserModel from '@/model/User';
import { Message } from '@/model/User';
import apiResponse from '@/utils/apiResponse';

export async function POST(request: Request) {
    await DbConnection()
  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username }).exec();

    if (!user) {
     return apiResponse(false,"there is no user with this username",401);
    }

    // Check if the user is accepting messages
    if (!user.isAccepting) {
      return apiResponse(false,'User is not accepting messages',401);
    }

    const newMessage = { content, createdAt: new Date() };
    // Push the new message to the user's messages array
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      { message: 'Message sent successfully', success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding message:', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
