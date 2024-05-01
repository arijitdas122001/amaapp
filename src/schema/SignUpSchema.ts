import { z } from "zod";

export const SignUpSchema=z.object({
    username:z
    .string()
    .min(3,{message:"userName must be greater that 3 charecters"})
    .max(10,{message:"userName must be under 10 charecters"}),
    email:z.string().email(),
    password:z
    .string()
    .min(6,{message:"password must be at least 6 charecters"})
    .max(12,{message:"password must be within 12 charecters"}),
    
})