import { Rating } from "../../generated/enums"

export interface IUpdateAddress{
  fullName : string,
  phone : string,
  city : string,
  area ?: string,
  street ?: string,
  houseNo ?: string,
  postalCode ?: string
}

// model Review {
//   id         String   @id @default(uuid())
//   userId     String
//   medicineId String
//   medicine   Medicine @relation(fields: [medicineId], references: [id], onDelete: Cascade, onUpdate: Cascade)
//   rating     Rating?
//   description String
//   customer    Customer @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)

//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt

//   @@map("reviews")
// }

export interface IReview{
  medicineId : string,
  rating ?: Rating,
  description : string,
}