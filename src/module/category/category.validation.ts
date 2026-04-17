import z from "zod";

export const createCategoryZodSchema = z.object({
    categoryName: z.string().min(1, "Category name is required").max(30, "Category name must be less than 30 characters"),
    description: z.string().optional(),
})