import z from "zod";

export const createSellerZodSchema = z.object({
  password : z.string("Password is required").min(6,"Password must be at least 6 characters long"),
  seller : z.object({
    name : z.string("Seller name is required").min(3,"Seller name must be at least 3 characters long").max(15,"Seller name must be less than 15 characters long"),
    email : z.email("Valid email is required"),
    profilePhoto : z.url("Valid URL is required").optional(),
    contactNumber : z.string("Contact number is required").min(11,"Contact number must be at least 11 characters long").max(14,"Contact number must be less than 15 characters long").optional(),
  })
})

export const createAdminZodSchema = z.object({
  password : z.string("Password is required").min(6,"Password must be at least 6 characters long"),
  admin : z.object({ 
    name : z.string("Admin name is required").min(3,"Admin name must be at least 3 characters long").max(15,"Admin name must be less than 15 characters long"),
    email : z.email("Valid email is required"),
    profilePhoto : z.url("Valid URL is required").optional(),
    contactNumber : z.string("Contact number is required").min(11,"Contact number must be at least 11 characters long").max(14,"Contact number must be less than 15 characters long").optional(),
  })
})
