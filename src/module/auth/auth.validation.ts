import z from "zod";

export const CreateCustomerZodSchema = z.object({
  name: z.string().min(1, "Name is required").max(15, "Name must be less than 15 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  image : z.url("Invalid image URL").optional()
})

export const LoginZodSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
})