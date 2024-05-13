import { z } from "zod";

export const SignInSchema=z.object({
    email:z
    .string()
    .email(),
    password:z
    .string()
    .min(6,{message:"password must be at least 6 charecters"})
    .max(12,{message:"password must be within 12 charecters"}) 
})