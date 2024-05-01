import { z } from "zod";
export const VerifySchema=z.object({
    verificationCode:z.string()
});