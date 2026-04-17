import { z } from "zod";

export const createOrderZodSchema = z.object({
  medicineId : z.string('You have to provide medecineId'),
  quantity: z.number().min(1, "Quantity must be a positive number"),
  addressId : z.string('You must provide addressId') 
});