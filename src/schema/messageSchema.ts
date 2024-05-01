import { z } from "zod";

export const messageSchema=z.object({
    Content:z.string().max(200,{message:"Message must be under 200 words"})
})