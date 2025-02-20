import zod from "zod";
export const signUpSchema = zod.object({
    email: zod.string().email({message: "Invalid email address"}),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
})

export const loginSchema = zod.object({
    email: zod.string().email({message: "Invalid email address"}),
    password: zod.string()
})

export const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
})