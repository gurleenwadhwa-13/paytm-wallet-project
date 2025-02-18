import zod from "zod";
export const signUpSchema = zod.object({
    email: zod.string(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
})