import { z } from "zod";

export const SignUpSchema=z.object({
    username:z
     .string()
    .min(2, 'Username must be at least 2 characters')
    .max(20, 'Username must be no more than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters'),
    email:z.string().email(),
    password:z
    .string()
    .min(6,{message:"password must be at least 6 charecters"})
    .max(12,{message:"password must be within 12 charecters"}),
    
})