// model Address {
//   id       String @id @default(uuid())

//   fullName String
//   phone    String
//   city     String
  
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt

//   userId     String   @unique
//   user       User     @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)

//   orders   Order[]

//   @@map("address")
//   @@unique([id, userId])
// }

export interface ICreateSellerAddress {
  fullName ?: string;
  phone ?: string;
  city ?: string;
}

export interface ICreateSellerPayload {
  password : string;
  seller : {
    name : string;
    email : string;
    profilePhoto? : string;
    contactNumber? : string;
    address? : ICreateSellerAddress;
  }
}

export interface ICreateAdminPayload {
  password : string;
  admin : {
    name : string;
    email : string;
    profilePhoto? : string;
    contactNumber? : string;
  }
}