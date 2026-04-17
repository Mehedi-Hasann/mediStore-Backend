import z from "zod";


export const createAddressZodSchema = z.object({
    fullName: z.string().min(1, "Full name is required").max(20, "Full name must be less than 20 characters").optional(),
    phone: z.string().min(11, "Phone number must be at least 11 characters").max(14, "Phone number must be less than 14 characters").optional(),
}).partial();

export const createReviewZodSchema = z.object({
    medicineId: z.string().min(1, "Medicine ID is required"),
    description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
})