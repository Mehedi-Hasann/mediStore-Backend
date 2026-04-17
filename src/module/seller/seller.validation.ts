import z from "zod";

export const createMedicineZodSchema = z.object({
  name: z.string().min(1, "Medicine name is required"),
  price: z.number().int().positive("Price must be a positive integer"),
  stock: z.number().int().nonnegative("Stock must be a non-negative integer"),
  categoryId: z.string().min(1, "Category ID is required"),
});