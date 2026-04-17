// src/app.ts
import express7 from "express";

// src/module/medicine/medicine.route.ts
import express from "express";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.4.1",
  "engineVersion": "55ae170b1ced7fc6ed07a15f110549408c501bb3",
  "activeProvider": "postgresql",
  "inlineSchema": 'model Address {\n  id String @id @default(uuid())\n\n  fullName   String\n  phone      String\n  city       String\n  area       String?\n  street     String?\n  houseNo    String?\n  postalCode String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  orders Order[]\n\n  @@unique([id, userId])\n  @@map("address")\n}\n\nmodel Admin {\n  id            String    @id @default(uuid(7))\n  name          String\n  email         String    @unique\n  profilePhoto  String?\n  contactNumber String?\n  isDeleted     Boolean   @default(false)\n  deletedAt     DateTime?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  @@index([email])\n  @@index([isDeleted])\n  @@map("admins")\n}\n\nmodel User {\n  id                 String    @id\n  name               String\n  email              String\n  emailVerified      Boolean   @default(false)\n  needPasswordChange Boolean   @default(false)\n  isDeleted          Boolean   @default(false)\n  deletedAt          DateTime?\n  image              String?\n  createdAt          DateTime  @default(now())\n  updatedAt          DateTime  @updatedAt\n  sessions           Session[]\n  accounts           Account[]\n  cart               Cart[]\n  address            Address?\n\n  role       Role?       @default(CUSTOMER)\n  userStatus UserStatus? @default(ACTIVE)\n\n  payments Payment[]\n  customer Customer?\n  seller   Seller?\n  admin    Admin?\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Cart {\n  id     String @id @default(uuid())\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  medicineId String\n  medicine   Medicine @relation(fields: [medicineId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  quantity  Int      @default(1)\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([userId, medicineId])\n  @@map("carts")\n}\n\nmodel Category {\n  id           String     @id @default(uuid())\n  medicines    Medicine[]\n  categoryName String     @unique\n  description  String?\n\n  @@map("categories")\n}\n\nmodel Customer {\n  id String @id @default(uuid(7))\n\n  name          String\n  email         String    @unique\n  profilePhoto  String?\n  contactNumber String?\n  address       String?\n  isDeleted     Boolean   @default(false)\n  deletedAt     DateTime?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n\n  //relations\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  @@index([email], name: "idx_customer_email")\n  @@index([isDeleted], name: "idx_customer_isDeleted")\n  @@map("customer")\n}\n\nenum Rating {\n  ONE\n  TWO\n  THREE\n  FOUR\n  FIVE\n}\n\nenum UserStatus {\n  ACTIVE\n  DELETED\n  BLOCKED\n}\n\nenum OrderStatus {\n  PENDING\n  CONFIRMED\n  SHIPPED\n  DELIVERED\n  CANCELLED\n}\n\nenum Role {\n  CUSTOMER\n  SELLER\n  ADMIN\n}\n\nenum PaymentStatus {\n  PAID\n  UNPAID\n  CANCELLED\n}\n\nmodel Medicine {\n  id           String   @id @default(uuid())\n  name         String   @unique\n  price        Int\n  stock        Int\n  categoryId   String\n  category     Category @relation(fields: [categoryId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  categoryName String\n  orders       Order[]\n  reviews      Review[]\n  cart         Cart[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("medicines")\n}\n\nmodel Order {\n  id          String @id @default(uuid())\n  totalAmount Int\n  quantity    Int\n  userId      String\n\n  medicineId String\n  medicine   Medicine @relation(fields: [medicineId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  addressId String\n  address   Address @relation(fields: [addressId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  orderStatus   OrderStatus   @default(PENDING)\n  paymentStatus PaymentStatus @default(UNPAID)\n  createdAt     DateTime      @default(now())\n\n  payment Payment?\n\n  @@map("orders")\n}\n\nmodel Payment {\n  id            String        @id @default(uuid(7))\n  amount        Float\n  transactionId String        @unique @db.Uuid()\n  stripeEventId String?       @unique\n  status        PaymentStatus @default(UNPAID)\n\n  orderId String @unique\n  order   Order  @relation(fields: [orderId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  userId  String\n  user    User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([transactionId])\n  @@map("payments")\n}\n\nmodel Review {\n  id          String   @id @default(uuid())\n  userId      String\n  medicineId  String\n  medicine    Medicine @relation(fields: [medicineId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  rating      Rating?\n  description String\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("reviews")\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Seller {\n  id String @id @default(uuid(7))\n\n  name          String\n  email         String    @unique\n  profilePhoto  String?\n  contactNumber String?\n  address       String?\n  isDeleted     Boolean   @default(false)\n  deletedAt     DateTime?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n\n  //relations\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  @@index([email], name: "idx_seller_email")\n  @@index([isDeleted], name: "idx_seller_isDeleted")\n  @@map("seller")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Address":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"area","kind":"scalar","type":"String"},{"name":"street","kind":"scalar","type":"String"},{"name":"houseNo","kind":"scalar","type":"String"},{"name":"postalCode","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AddressToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"AddressToOrder"}],"dbName":"address"},"Admin":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"contactNumber","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminToUser"}],"dbName":"admins"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToUser"},{"name":"address","kind":"object","type":"Address","relationName":"AddressToUser"},{"name":"role","kind":"enum","type":"Role"},{"name":"userStatus","kind":"enum","type":"UserStatus"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"},{"name":"customer","kind":"object","type":"Customer","relationName":"CustomerToUser"},{"name":"seller","kind":"object","type":"Seller","relationName":"SellerToUser"},{"name":"admin","kind":"object","type":"Admin","relationName":"AdminToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Cart":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"CartToUser"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"CartToMedicine"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"carts"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"CategoryToMedicine"},{"name":"categoryName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"}],"dbName":"categories"},"Customer":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"contactNumber","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"CustomerToUser"}],"dbName":"customer"},"Medicine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Int"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMedicine"},{"name":"categoryName","kind":"scalar","type":"String"},{"name":"orders","kind":"object","type":"Order","relationName":"MedicineToOrder"},{"name":"reviews","kind":"object","type":"Review","relationName":"MedicineToReview"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToMedicine"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"medicines"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"totalAmount","kind":"scalar","type":"Int"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"userId","kind":"scalar","type":"String"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToOrder"},{"name":"addressId","kind":"scalar","type":"String"},{"name":"address","kind":"object","type":"Address","relationName":"AddressToOrder"},{"name":"orderStatus","kind":"enum","type":"OrderStatus"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"payment","kind":"object","type":"Payment","relationName":"OrderToPayment"}],"dbName":"orders"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"stripeEventId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToPayment"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"payments"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToReview"},{"name":"rating","kind":"enum","type":"Rating"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"reviews"},"Seller":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"contactNumber","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SellerToUser"}],"dbName":"seller"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","medicines","_count","category","medicine","address","order","payment","orders","reviews","cart","payments","customer","seller","admin","Address.findUnique","Address.findUniqueOrThrow","Address.findFirst","Address.findFirstOrThrow","Address.findMany","data","Address.createOne","Address.createMany","Address.createManyAndReturn","Address.updateOne","Address.updateMany","Address.updateManyAndReturn","create","update","Address.upsertOne","Address.deleteOne","Address.deleteMany","having","_min","_max","Address.groupBy","Address.aggregate","Admin.findUnique","Admin.findUniqueOrThrow","Admin.findFirst","Admin.findFirstOrThrow","Admin.findMany","Admin.createOne","Admin.createMany","Admin.createManyAndReturn","Admin.updateOne","Admin.updateMany","Admin.updateManyAndReturn","Admin.upsertOne","Admin.deleteOne","Admin.deleteMany","Admin.groupBy","Admin.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Cart.findUnique","Cart.findUniqueOrThrow","Cart.findFirst","Cart.findFirstOrThrow","Cart.findMany","Cart.createOne","Cart.createMany","Cart.createManyAndReturn","Cart.updateOne","Cart.updateMany","Cart.updateManyAndReturn","Cart.upsertOne","Cart.deleteOne","Cart.deleteMany","_avg","_sum","Cart.groupBy","Cart.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","Customer.findUnique","Customer.findUniqueOrThrow","Customer.findFirst","Customer.findFirstOrThrow","Customer.findMany","Customer.createOne","Customer.createMany","Customer.createManyAndReturn","Customer.updateOne","Customer.updateMany","Customer.updateManyAndReturn","Customer.upsertOne","Customer.deleteOne","Customer.deleteMany","Customer.groupBy","Customer.aggregate","Medicine.findUnique","Medicine.findUniqueOrThrow","Medicine.findFirst","Medicine.findFirstOrThrow","Medicine.findMany","Medicine.createOne","Medicine.createMany","Medicine.createManyAndReturn","Medicine.updateOne","Medicine.updateMany","Medicine.updateManyAndReturn","Medicine.upsertOne","Medicine.deleteOne","Medicine.deleteMany","Medicine.groupBy","Medicine.aggregate","Order.findUnique","Order.findUniqueOrThrow","Order.findFirst","Order.findFirstOrThrow","Order.findMany","Order.createOne","Order.createMany","Order.createManyAndReturn","Order.updateOne","Order.updateMany","Order.updateManyAndReturn","Order.upsertOne","Order.deleteOne","Order.deleteMany","Order.groupBy","Order.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","Seller.findUnique","Seller.findUniqueOrThrow","Seller.findFirst","Seller.findFirstOrThrow","Seller.findMany","Seller.createOne","Seller.createMany","Seller.createManyAndReturn","Seller.updateOne","Seller.updateMany","Seller.updateManyAndReturn","Seller.upsertOne","Seller.deleteOne","Seller.deleteMany","Seller.groupBy","Seller.aggregate","AND","OR","NOT","id","name","email","profilePhoto","contactNumber","isDeleted","deletedAt","createdAt","updatedAt","userId","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","medicineId","Rating","rating","description","amount","transactionId","stripeEventId","PaymentStatus","status","orderId","totalAmount","quantity","addressId","OrderStatus","orderStatus","paymentStatus","price","stock","categoryId","categoryName","every","some","none","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","emailVerified","needPasswordChange","image","Role","role","UserStatus","userStatus","fullName","phone","city","area","street","houseNo","postalCode","userId_medicineId","id_userId","is","isNot","connectOrCreate","upsert","disconnect","delete","connect","createMany","set","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "rgZ94AERAwAAjgMAIA0AAMcDACD8AQAAxgMAMP0BAAAiABD-AQAAxgMAMP8BAQAAAAGGAkAAjQMAIYcCQACNAwAhiAIBAAAAAcECAQCJAwAhwgIBAIkDACHDAgEAiQMAIcQCAQCKAwAhxQIBAIoDACHGAgEAigMAIccCAQCKAwAhyQIAANkDACABAAAAAQAgDAMAAI4DACD8AQAA2AMAMP0BAAADABD-AQAA2AMAMP8BAQCJAwAhhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhrQJAAI0DACG3AgEAiQMAIbgCAQCKAwAhuQIBAIoDACEDAwAA5QMAILgCAADaAwAguQIAANoDACAMAwAAjgMAIPwBAADYAwAw_QEAAAMAEP4BAADYAwAw_wEBAAAAAYYCQACNAwAhhwJAAI0DACGIAgEAiQMAIa0CQACNAwAhtwIBAAAAAbgCAQCKAwAhuQIBAIoDACEDAAAAAwAgAQAABAAwAgAABQAgEQMAAI4DACD8AQAA1wMAMP0BAAAHABD-AQAA1wMAMP8BAQCJAwAhhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhrgIBAIkDACGvAgEAiQMAIbACAQCKAwAhsQIBAIoDACGyAgEAigMAIbMCQACMAwAhtAJAAIwDACG1AgEAigMAIbYCAQCKAwAhCAMAAOUDACCwAgAA2gMAILECAADaAwAgsgIAANoDACCzAgAA2gMAILQCAADaAwAgtQIAANoDACC2AgAA2gMAIBEDAACOAwAg_AEAANcDADD9AQAABwAQ_gEAANcDADD_AQEAAAABhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhrgIBAIkDACGvAgEAiQMAIbACAQCKAwAhsQIBAIoDACGyAgEAigMAIbMCQACMAwAhtAJAAIwDACG1AgEAigMAIbYCAQCKAwAhAwAAAAcAIAEAAAgAMAIAAAkAIAsDAACOAwAgCQAAygMAIPwBAADWAwAw_QEAAAsAEP4BAADWAwAw_wEBAIkDACGGAkAAjQMAIYcCQACNAwAhiAIBAIkDACGUAgEAiQMAIZ8CAgDOAwAhAgMAAOUDACAJAADcBQAgDAMAAI4DACAJAADKAwAg_AEAANYDADD9AQAACwAQ_gEAANYDADD_AQEAAAABhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhlAIBAIkDACGfAgIAzgMAIcgCAADVAwAgAwAAAAsAIAEAAAwAMAIAAA0AIA8IAADTAwAgDQAAxwMAIA4AANQDACAPAAC5AwAg_AEAANIDADD9AQAADwAQ_gEAANIDADD_AQEAiQMAIYACAQCJAwAhhgJAAI0DACGHAkAAjQMAIaQCAgDOAwAhpQICAM4DACGmAgEAiQMAIacCAQCJAwAhBAgAAN4FACANAADaBQAgDgAA3wUAIA8AAMoFACAPCAAA0wMAIA0AAMcDACAOAADUAwAgDwAAuQMAIPwBAADSAwAw_QEAAA8AEP4BAADSAwAw_wEBAAAAAYACAQAAAAGGAkAAjQMAIYcCQACNAwAhpAICAM4DACGlAgIAzgMAIaYCAQCJAwAhpwIBAIkDACEDAAAADwAgAQAAEAAwAgAAEQAgAQAAAA8AIA8JAADKAwAgCgAA0AMAIAwAANEDACD8AQAAzQMAMP0BAAAUABD-AQAAzQMAMP8BAQCJAwAhhgJAAI0DACGIAgEAiQMAIZQCAQCJAwAhngICAM4DACGfAgIAzgMAIaACAQCJAwAhogIAAM8DogIiowIAAMQDnAIiAwkAANwFACAKAADLBQAgDAAA3QUAIA8JAADKAwAgCgAA0AMAIAwAANEDACD8AQAAzQMAMP0BAAAUABD-AQAAzQMAMP8BAQAAAAGGAkAAjQMAIYgCAQCJAwAhlAIBAIkDACGeAgIAzgMAIZ8CAgDOAwAhoAIBAIkDACGiAgAAzwOiAiKjAgAAxAOcAiIDAAAAFAAgAQAAFQAwAgAAFgAgDgMAAI4DACALAADFAwAg_AEAAMIDADD9AQAAGAAQ_gEAAMIDADD_AQEAiQMAIYYCQACNAwAhhwJAAI0DACGIAgEAiQMAIZgCCADDAwAhmQIBAMsDACGaAgEAigMAIZwCAADEA5wCIp0CAQCJAwAhAQAAABgAIAsJAADKAwAg_AEAAMgDADD9AQAAGgAQ_gEAAMgDADD_AQEAiQMAIYYCQACNAwAhhwJAAI0DACGIAgEAiQMAIZQCAQCJAwAhlgIAAMkDlgIjlwIBAIkDACECCQAA3AUAIJYCAADaAwAgCwkAAMoDACD8AQAAyAMAMP0BAAAaABD-AQAAyAMAMP8BAQAAAAGGAkAAjQMAIYcCQACNAwAhiAIBAIkDACGUAgEAiQMAIZYCAADJA5YCI5cCAQCJAwAhAwAAABoAIAEAABsAMAIAABwAIAMAAAALACABAAAMADACAAANACABAAAAFAAgAQAAABoAIAEAAAALACAQAwAAjgMAIA0AAMcDACD8AQAAxgMAMP0BAAAiABD-AQAAxgMAMP8BAQCJAwAhhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhwQIBAIkDACHCAgEAiQMAIcMCAQCJAwAhxAIBAIoDACHFAgEAigMAIcYCAQCKAwAhxwIBAIoDACEBAAAAIgAgAwMAAOUDACALAADbBQAgmgIAANoDACAOAwAAjgMAIAsAAMUDACD8AQAAwgMAMP0BAAAYABD-AQAAwgMAMP8BAQAAAAGGAkAAjQMAIYcCQACNAwAhiAIBAIkDACGYAggAwwMAIZkCAQAAAAGaAgEAAAABnAIAAMQDnAIinQIBAAAAAQMAAAAYACABAAAkADACAAAlACAPAwAAjgMAIAoBAIoDACH8AQAApAMAMP0BAAAnABD-AQAApAMAMP8BAQCJAwAhgAIBAIkDACGBAgEAiQMAIYICAQCKAwAhgwIBAIoDACGEAiAAiwMAIYUCQACMAwAhhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhAQAAACcAIA8DAACOAwAgCgEAigMAIfwBAACIAwAw_QEAACkAEP4BAACIAwAw_wEBAIkDACGAAgEAiQMAIYECAQCJAwAhggIBAIoDACGDAgEAigMAIYQCIACLAwAhhQJAAIwDACGGAkAAjQMAIYcCQACNAwAhiAIBAIkDACEBAAAAKQAgDgMAAI4DACD8AQAAwAMAMP0BAAArABD-AQAAwAMAMP8BAQCJAwAhgAIBAIkDACGBAgEAiQMAIYICAQCKAwAhgwIBAIoDACGEAiAAiwMAIYUCQACMAwAhhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhAQAAACsAIAEAAAADACABAAAABwAgAQAAAAsAIAEAAAAYACADAAAAFAAgAQAAFQAwAgAAFgAgAQAAABQAIAEAAAABACAGAwAA5QMAIA0AANoFACDEAgAA2gMAIMUCAADaAwAgxgIAANoDACDHAgAA2gMAIAMAAAAiACABAAA0ADACAAABACADAAAAIgAgAQAANAAwAgAAAQAgAwAAACIAIAEAADQAMAIAAAEAIA0DAADZBQAgDQAAngUAIP8BAQAAAAGGAkAAAAABhwJAAAAAAYgCAQAAAAHBAgEAAAABwgIBAAAAAcMCAQAAAAHEAgEAAAABxQIBAAAAAcYCAQAAAAHHAgEAAAABARkAADgAIAv_AQEAAAABhgJAAAAAAYcCQAAAAAGIAgEAAAABwQIBAAAAAcICAQAAAAHDAgEAAAABxAIBAAAAAcUCAQAAAAHGAgEAAAABxwIBAAAAAQEZAAA6ADABGQAAOgAwDQMAANgFACANAACUBQAg_wEBAN4DACGGAkAA4gMAIYcCQADiAwAhiAIBAN4DACHBAgEA3gMAIcICAQDeAwAhwwIBAN4DACHEAgEA3wMAIcUCAQDfAwAhxgIBAN8DACHHAgEA3wMAIQIAAAABACAZAAA9ACAL_wEBAN4DACGGAkAA4gMAIYcCQADiAwAhiAIBAN4DACHBAgEA3gMAIcICAQDeAwAhwwIBAN4DACHEAgEA3wMAIcUCAQDfAwAhxgIBAN8DACHHAgEA3wMAIQIAAAAiACAZAAA_ACACAAAAIgAgGQAAPwAgAwAAAAEAICAAADgAICEAAD0AIAEAAAABACABAAAAIgAgBwcAANUFACAmAADXBQAgJwAA1gUAIMQCAADaAwAgxQIAANoDACDGAgAA2gMAIMcCAADaAwAgDvwBAADBAwAw_QEAAEYAEP4BAADBAwAw_wEBAPcCACGGAkAA-wIAIYcCQAD7AgAhiAIBAPcCACHBAgEA9wIAIcICAQD3AgAhwwIBAPcCACHEAgEA-AIAIcUCAQD4AgAhxgIBAPgCACHHAgEA-AIAIQMAAAAiACABAABFADAlAABGACADAAAAIgAgAQAANAAwAgAAAQAgDgMAAI4DACD8AQAAwAMAMP0BAAArABD-AQAAwAMAMP8BAQAAAAGAAgEAiQMAIYECAQAAAAGCAgEAigMAIYMCAQCKAwAhhAIgAIsDACGFAkAAjAMAIYYCQACNAwAhhwJAAI0DACGIAgEAAAABAQAAAEkAIAEAAABJACAEAwAA5QMAIIICAADaAwAggwIAANoDACCFAgAA2gMAIAMAAAArACABAABMADACAABJACADAAAAKwAgAQAATAAwAgAASQAgAwAAACsAIAEAAEwAMAIAAEkAIAsDAADUBQAg_wEBAAAAAYACAQAAAAGBAgEAAAABggIBAAAAAYMCAQAAAAGEAiAAAAABhQJAAAAAAYYCQAAAAAGHAkAAAAABiAIBAAAAAQEZAABQACAK_wEBAAAAAYACAQAAAAGBAgEAAAABggIBAAAAAYMCAQAAAAGEAiAAAAABhQJAAAAAAYYCQAAAAAGHAkAAAAABiAIBAAAAAQEZAABSADABGQAAUgAwCwMAANMFACD_AQEA3gMAIYACAQDeAwAhgQIBAN4DACGCAgEA3wMAIYMCAQDfAwAhhAIgAOADACGFAkAA4QMAIYYCQADiAwAhhwJAAOIDACGIAgEA3gMAIQIAAABJACAZAABVACAK_wEBAN4DACGAAgEA3gMAIYECAQDeAwAhggIBAN8DACGDAgEA3wMAIYQCIADgAwAhhQJAAOEDACGGAkAA4gMAIYcCQADiAwAhiAIBAN4DACECAAAAKwAgGQAAVwAgAgAAACsAIBkAAFcAIAMAAABJACAgAABQACAhAABVACABAAAASQAgAQAAACsAIAYHAADQBQAgJgAA0gUAICcAANEFACCCAgAA2gMAIIMCAADaAwAghQIAANoDACAN_AEAAL8DADD9AQAAXgAQ_gEAAL8DADD_AQEA9wIAIYACAQD3AgAhgQIBAPcCACGCAgEA-AIAIYMCAQD4AgAhhAIgAPkCACGFAkAA-gIAIYYCQAD7AgAhhwJAAPsCACGIAgEA9wIAIQMAAAArACABAABdADAlAABeACADAAAAKwAgAQAATAAwAgAASQAgFwQAALcDACAFAAC4AwAgCgAAugMAIA8AALkDACAQAAC7AwAgEQAAvAMAIBIAAL0DACATAAC-AwAg_AEAALQDADD9AQAAZAAQ_gEAALQDADD_AQEAAAABgAIBAIkDACGBAgEAAAABhAIgAIsDACGFAkAAjAMAIYYCQACNAwAhhwJAAI0DACG6AiAAiwMAIbsCIACLAwAhvAIBAIoDACG-AgAAtQO-AiPAAgAAtgPAAiMBAAAAYQAgAQAAAGEAIBcEAAC3AwAgBQAAuAMAIAoAALoDACAPAAC5AwAgEAAAuwMAIBEAALwDACASAAC9AwAgEwAAvgMAIPwBAAC0AwAw_QEAAGQAEP4BAAC0AwAw_wEBAIkDACGAAgEAiQMAIYECAQCJAwAhhAIgAIsDACGFAkAAjAMAIYYCQACNAwAhhwJAAI0DACG6AiAAiwMAIbsCIACLAwAhvAIBAIoDACG-AgAAtQO-AiPAAgAAtgPAAiMMBAAAyAUAIAUAAMkFACAKAADLBQAgDwAAygUAIBAAAMwFACARAADNBQAgEgAAzgUAIBMAAM8FACCFAgAA2gMAILwCAADaAwAgvgIAANoDACDAAgAA2gMAIAMAAABkACABAABlADACAABhACADAAAAZAAgAQAAZQAwAgAAYQAgAwAAAGQAIAEAAGUAMAIAAGEAIBQEAADABQAgBQAAwQUAIAoAAMMFACAPAADCBQAgEAAAxAUAIBEAAMUFACASAADGBQAgEwAAxwUAIP8BAQAAAAGAAgEAAAABgQIBAAAAAYQCIAAAAAGFAkAAAAABhgJAAAAAAYcCQAAAAAG6AiAAAAABuwIgAAAAAbwCAQAAAAG-AgAAAL4CA8ACAAAAwAIDARkAAGkAIAz_AQEAAAABgAIBAAAAAYECAQAAAAGEAiAAAAABhQJAAAAAAYYCQAAAAAGHAkAAAAABugIgAAAAAbsCIAAAAAG8AgEAAAABvgIAAAC-AgPAAgAAAMACAwEZAABrADABGQAAawAwFAQAAOwEACAFAADtBAAgCgAA7wQAIA8AAO4EACAQAADwBAAgEQAA8QQAIBIAAPIEACATAADzBAAg_wEBAN4DACGAAgEA3gMAIYECAQDeAwAhhAIgAOADACGFAkAA4QMAIYYCQADiAwAhhwJAAOIDACG6AiAA4AMAIbsCIADgAwAhvAIBAN8DACG-AgAA6gS-AiPAAgAA6wTAAiMCAAAAYQAgGQAAbgAgDP8BAQDeAwAhgAIBAN4DACGBAgEA3gMAIYQCIADgAwAhhQJAAOEDACGGAkAA4gMAIYcCQADiAwAhugIgAOADACG7AiAA4AMAIbwCAQDfAwAhvgIAAOoEvgIjwAIAAOsEwAIjAgAAAGQAIBkAAHAAIAIAAABkACAZAABwACADAAAAYQAgIAAAaQAgIQAAbgAgAQAAAGEAIAEAAABkACAHBwAA5wQAICYAAOkEACAnAADoBAAghQIAANoDACC8AgAA2gMAIL4CAADaAwAgwAIAANoDACAP_AEAAK0DADD9AQAAdwAQ_gEAAK0DADD_AQEA9wIAIYACAQD3AgAhgQIBAPcCACGEAiAA-QIAIYUCQAD6AgAhhgJAAPsCACGHAkAA-wIAIboCIAD5AgAhuwIgAPkCACG8AgEA-AIAIb4CAACuA74CI8ACAACvA8ACIwMAAABkACABAAB2ADAlAAB3ACADAAAAZAAgAQAAZQAwAgAAYQAgAQAAAAUAIAEAAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACAJAwAA5gQAIP8BAQAAAAGGAkAAAAABhwJAAAAAAYgCAQAAAAGtAkAAAAABtwIBAAAAAbgCAQAAAAG5AgEAAAABARkAAH8AIAj_AQEAAAABhgJAAAAAAYcCQAAAAAGIAgEAAAABrQJAAAAAAbcCAQAAAAG4AgEAAAABuQIBAAAAAQEZAACBAQAwARkAAIEBADAJAwAA5QQAIP8BAQDeAwAhhgJAAOIDACGHAkAA4gMAIYgCAQDeAwAhrQJAAOIDACG3AgEA3gMAIbgCAQDfAwAhuQIBAN8DACECAAAABQAgGQAAhAEAIAj_AQEA3gMAIYYCQADiAwAhhwJAAOIDACGIAgEA3gMAIa0CQADiAwAhtwIBAN4DACG4AgEA3wMAIbkCAQDfAwAhAgAAAAMAIBkAAIYBACACAAAAAwAgGQAAhgEAIAMAAAAFACAgAAB_ACAhAACEAQAgAQAAAAUAIAEAAAADACAFBwAA4gQAICYAAOQEACAnAADjBAAguAIAANoDACC5AgAA2gMAIAv8AQAArAMAMP0BAACNAQAQ_gEAAKwDADD_AQEA9wIAIYYCQAD7AgAhhwJAAPsCACGIAgEA9wIAIa0CQAD7AgAhtwIBAPcCACG4AgEA-AIAIbkCAQD4AgAhAwAAAAMAIAEAAIwBADAlAACNAQAgAwAAAAMAIAEAAAQAMAIAAAUAIAEAAAAJACABAAAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgDgMAAOEEACD_AQEAAAABhgJAAAAAAYcCQAAAAAGIAgEAAAABrgIBAAAAAa8CAQAAAAGwAgEAAAABsQIBAAAAAbICAQAAAAGzAkAAAAABtAJAAAAAAbUCAQAAAAG2AgEAAAABARkAAJUBACAN_wEBAAAAAYYCQAAAAAGHAkAAAAABiAIBAAAAAa4CAQAAAAGvAgEAAAABsAIBAAAAAbECAQAAAAGyAgEAAAABswJAAAAAAbQCQAAAAAG1AgEAAAABtgIBAAAAAQEZAACXAQAwARkAAJcBADAOAwAA4AQAIP8BAQDeAwAhhgJAAOIDACGHAkAA4gMAIYgCAQDeAwAhrgIBAN4DACGvAgEA3gMAIbACAQDfAwAhsQIBAN8DACGyAgEA3wMAIbMCQADhAwAhtAJAAOEDACG1AgEA3wMAIbYCAQDfAwAhAgAAAAkAIBkAAJoBACAN_wEBAN4DACGGAkAA4gMAIYcCQADiAwAhiAIBAN4DACGuAgEA3gMAIa8CAQDeAwAhsAIBAN8DACGxAgEA3wMAIbICAQDfAwAhswJAAOEDACG0AkAA4QMAIbUCAQDfAwAhtgIBAN8DACECAAAABwAgGQAAnAEAIAIAAAAHACAZAACcAQAgAwAAAAkAICAAAJUBACAhAACaAQAgAQAAAAkAIAEAAAAHACAKBwAA3QQAICYAAN8EACAnAADeBAAgsAIAANoDACCxAgAA2gMAILICAADaAwAgswIAANoDACC0AgAA2gMAILUCAADaAwAgtgIAANoDACAQ_AEAAKsDADD9AQAAowEAEP4BAACrAwAw_wEBAPcCACGGAkAA-wIAIYcCQAD7AgAhiAIBAPcCACGuAgEA9wIAIa8CAQD3AgAhsAIBAPgCACGxAgEA-AIAIbICAQD4AgAhswJAAPoCACG0AkAA-gIAIbUCAQD4AgAhtgIBAPgCACEDAAAABwAgAQAAogEAMCUAAKMBACADAAAABwAgAQAACAAwAgAACQAgCfwBAACqAwAw_QEAAKkBABD-AQAAqgMAMP8BAQAAAAGGAkAAjQMAIYcCQACNAwAhqwIBAIkDACGsAgEAiQMAIa0CQACNAwAhAQAAAKYBACABAAAApgEAIAn8AQAAqgMAMP0BAACpAQAQ_gEAAKoDADD_AQEAiQMAIYYCQACNAwAhhwJAAI0DACGrAgEAiQMAIawCAQCJAwAhrQJAAI0DACEAAwAAAKkBACABAACqAQAwAgAApgEAIAMAAACpAQAgAQAAqgEAMAIAAKYBACADAAAAqQEAIAEAAKoBADACAACmAQAgBv8BAQAAAAGGAkAAAAABhwJAAAAAAasCAQAAAAGsAgEAAAABrQJAAAAAAQEZAACuAQAgBv8BAQAAAAGGAkAAAAABhwJAAAAAAasCAQAAAAGsAgEAAAABrQJAAAAAAQEZAACwAQAwARkAALABADAG_wEBAN4DACGGAkAA4gMAIYcCQADiAwAhqwIBAN4DACGsAgEA3gMAIa0CQADiAwAhAgAAAKYBACAZAACzAQAgBv8BAQDeAwAhhgJAAOIDACGHAkAA4gMAIasCAQDeAwAhrAIBAN4DACGtAkAA4gMAIQIAAACpAQAgGQAAtQEAIAIAAACpAQAgGQAAtQEAIAMAAACmAQAgIAAArgEAICEAALMBACABAAAApgEAIAEAAACpAQAgAwcAANoEACAmAADcBAAgJwAA2wQAIAn8AQAAqQMAMP0BAAC8AQAQ_gEAAKkDADD_AQEA9wIAIYYCQAD7AgAhhwJAAPsCACGrAgEA9wIAIawCAQD3AgAhrQJAAPsCACEDAAAAqQEAIAEAALsBADAlAAC8AQAgAwAAAKkBACABAACqAQAwAgAApgEAIAEAAAANACABAAAADQAgAwAAAAsAIAEAAAwAMAIAAA0AIAMAAAALACABAAAMADACAAANACADAAAACwAgAQAADAAwAgAADQAgCAMAAJ8EACAJAADZBAAg_wEBAAAAAYYCQAAAAAGHAkAAAAABiAIBAAAAAZQCAQAAAAGfAgIAAAABARkAAMQBACAG_wEBAAAAAYYCQAAAAAGHAkAAAAABiAIBAAAAAZQCAQAAAAGfAgIAAAABARkAAMYBADABGQAAxgEAMAgDAACdBAAgCQAA2AQAIP8BAQDeAwAhhgJAAOIDACGHAkAA4gMAIYgCAQDeAwAhlAIBAN4DACGfAgIA_AMAIQIAAAANACAZAADJAQAgBv8BAQDeAwAhhgJAAOIDACGHAkAA4gMAIYgCAQDeAwAhlAIBAN4DACGfAgIA_AMAIQIAAAALACAZAADLAQAgAgAAAAsAIBkAAMsBACADAAAADQAgIAAAxAEAICEAAMkBACABAAAADQAgAQAAAAsAIAUHAADTBAAgJgAA1gQAICcAANUEACCIAQAA1AQAIIkBAADXBAAgCfwBAACoAwAw_QEAANIBABD-AQAAqAMAMP8BAQD3AgAhhgJAAPsCACGHAkAA-wIAIYgCAQD3AgAhlAIBAPcCACGfAgIAnQMAIQMAAAALACABAADRAQAwJQAA0gEAIAMAAAALACABAAAMADACAAANACAHBgAApwMAIPwBAACmAwAw_QEAANgBABD-AQAApgMAMP8BAQAAAAGXAgEAigMAIacCAQAAAAEBAAAA1QEAIAEAAADVAQAgBwYAAKcDACD8AQAApgMAMP0BAADYAQAQ_gEAAKYDADD_AQEAiQMAIZcCAQCKAwAhpwIBAIkDACECBgAA0gQAIJcCAADaAwAgAwAAANgBACABAADZAQAwAgAA1QEAIAMAAADYAQAgAQAA2QEAMAIAANUBACADAAAA2AEAIAEAANkBADACAADVAQAgBAYAANEEACD_AQEAAAABlwIBAAAAAacCAQAAAAEBGQAA3QEAIAP_AQEAAAABlwIBAAAAAacCAQAAAAEBGQAA3wEAMAEZAADfAQAwBAYAAMQEACD_AQEA3gMAIZcCAQDfAwAhpwIBAN4DACECAAAA1QEAIBkAAOIBACAD_wEBAN4DACGXAgEA3wMAIacCAQDeAwAhAgAAANgBACAZAADkAQAgAgAAANgBACAZAADkAQAgAwAAANUBACAgAADdAQAgIQAA4gEAIAEAAADVAQAgAQAAANgBACAEBwAAwQQAICYAAMMEACAnAADCBAAglwIAANoDACAG_AEAAKUDADD9AQAA6wEAEP4BAAClAwAw_wEBAPcCACGXAgEA-AIAIacCAQD3AgAhAwAAANgBACABAADqAQAwJQAA6wEAIAMAAADYAQAgAQAA2QEAMAIAANUBACAPAwAAjgMAIAoBAIoDACH8AQAApAMAMP0BAAAnABD-AQAApAMAMP8BAQAAAAGAAgEAiQMAIYECAQAAAAGCAgEAigMAIYMCAQCKAwAhhAIgAIsDACGFAkAAjAMAIYYCQACNAwAhhwJAAI0DACGIAgEAAAABAQAAAO4BACABAAAA7gEAIAUDAADlAwAgCgAA2gMAIIICAADaAwAggwIAANoDACCFAgAA2gMAIAMAAAAnACABAADxAQAwAgAA7gEAIAMAAAAnACABAADxAQAwAgAA7gEAIAMAAAAnACABAADxAQAwAgAA7gEAIAwDAADABAAgCgEAAAAB_wEBAAAAAYACAQAAAAGBAgEAAAABggIBAAAAAYMCAQAAAAGEAiAAAAABhQJAAAAAAYYCQAAAAAGHAkAAAAABiAIBAAAAAQEZAAD1AQAgCwoBAAAAAf8BAQAAAAGAAgEAAAABgQIBAAAAAYICAQAAAAGDAgEAAAABhAIgAAAAAYUCQAAAAAGGAkAAAAABhwJAAAAAAYgCAQAAAAEBGQAA9wEAMAEZAAD3AQAwDAMAAL8EACAKAQDfAwAh_wEBAN4DACGAAgEA3gMAIYECAQDeAwAhggIBAN8DACGDAgEA3wMAIYQCIADgAwAhhQJAAOEDACGGAkAA4gMAIYcCQADiAwAhiAIBAN4DACECAAAA7gEAIBkAAPoBACALCgEA3wMAIf8BAQDeAwAhgAIBAN4DACGBAgEA3gMAIYICAQDfAwAhgwIBAN8DACGEAiAA4AMAIYUCQADhAwAhhgJAAOIDACGHAkAA4gMAIYgCAQDeAwAhAgAAACcAIBkAAPwBACACAAAAJwAgGQAA_AEAIAMAAADuAQAgIAAA9QEAICEAAPoBACABAAAA7gEAIAEAAAAnACAHBwAAvAQAIAoAANoDACAmAAC-BAAgJwAAvQQAIIICAADaAwAggwIAANoDACCFAgAA2gMAIA4KAQD4AgAh_AEAAKMDADD9AQAAgwIAEP4BAACjAwAw_wEBAPcCACGAAgEA9wIAIYECAQD3AgAhggIBAPgCACGDAgEA-AIAIYQCIAD5AgAhhQJAAPoCACGGAkAA-wIAIYcCQAD7AgAhiAIBAPcCACEDAAAAJwAgAQAAggIAMCUAAIMCACADAAAAJwAgAQAA8QEAMAIAAO4BACABAAAAEQAgAQAAABEAIAMAAAAPACABAAAQADACAAARACADAAAADwAgAQAAEAAwAgAAEQAgAwAAAA8AIAEAABAAMAIAABEAIAwIAAC4BAAgDQAAuQQAIA4AALoEACAPAAC7BAAg_wEBAAAAAYACAQAAAAGGAkAAAAABhwJAAAAAAaQCAgAAAAGlAgIAAAABpgIBAAAAAacCAQAAAAEBGQAAiwIAIAj_AQEAAAABgAIBAAAAAYYCQAAAAAGHAkAAAAABpAICAAAAAaUCAgAAAAGmAgEAAAABpwIBAAAAAQEZAACNAgAwARkAAI0CADAMCAAAjgQAIA0AAI8EACAOAACQBAAgDwAAkQQAIP8BAQDeAwAhgAIBAN4DACGGAkAA4gMAIYcCQADiAwAhpAICAPwDACGlAgIA_AMAIaYCAQDeAwAhpwIBAN4DACECAAAAEQAgGQAAkAIAIAj_AQEA3gMAIYACAQDeAwAhhgJAAOIDACGHAkAA4gMAIaQCAgD8AwAhpQICAPwDACGmAgEA3gMAIacCAQDeAwAhAgAAAA8AIBkAAJICACACAAAADwAgGQAAkgIAIAMAAAARACAgAACLAgAgIQAAkAIAIAEAAAARACABAAAADwAgBQcAAIkEACAmAACMBAAgJwAAiwQAIIgBAACKBAAgiQEAAI0EACAL_AEAAKIDADD9AQAAmQIAEP4BAACiAwAw_wEBAPcCACGAAgEA9wIAIYYCQAD7AgAhhwJAAPsCACGkAgIAnQMAIaUCAgCdAwAhpgIBAPcCACGnAgEA9wIAIQMAAAAPACABAACYAgAwJQAAmQIAIAMAAAAPACABAAAQADACAAARACABAAAAFgAgAQAAABYAIAMAAAAUACABAAAVADACAAAWACADAAAAFAAgAQAAFQAwAgAAFgAgAwAAABQAIAEAABUAMAIAABYAIAwJAACGBAAgCgAAhwQAIAwAAIgEACD_AQEAAAABhgJAAAAAAYgCAQAAAAGUAgEAAAABngICAAAAAZ8CAgAAAAGgAgEAAAABogIAAACiAgKjAgAAAJwCAgEZAAChAgAgCf8BAQAAAAGGAkAAAAABiAIBAAAAAZQCAQAAAAGeAgIAAAABnwICAAAAAaACAQAAAAGiAgAAAKICAqMCAAAAnAICARkAAKMCADABGQAAowIAMAwJAAD-AwAgCgAA_wMAIAwAAIAEACD_AQEA3gMAIYYCQADiAwAhiAIBAN4DACGUAgEA3gMAIZ4CAgD8AwAhnwICAPwDACGgAgEA3gMAIaICAAD9A6ICIqMCAADyA5wCIgIAAAAWACAZAACmAgAgCf8BAQDeAwAhhgJAAOIDACGIAgEA3gMAIZQCAQDeAwAhngICAPwDACGfAgIA_AMAIaACAQDeAwAhogIAAP0DogIiowIAAPIDnAIiAgAAABQAIBkAAKgCACACAAAAFAAgGQAAqAIAIAMAAAAWACAgAAChAgAgIQAApgIAIAEAAAAWACABAAAAFAAgBQcAAPcDACAmAAD6AwAgJwAA-QMAIIgBAAD4AwAgiQEAAPsDACAM_AEAAJwDADD9AQAArwIAEP4BAACcAwAw_wEBAPcCACGGAkAA-wIAIYgCAQD3AgAhlAIBAPcCACGeAgIAnQMAIZ8CAgCdAwAhoAIBAPcCACGiAgAAngOiAiKjAgAAlgOcAiIDAAAAFAAgAQAArgIAMCUAAK8CACADAAAAFAAgAQAAFQAwAgAAFgAgAQAAACUAIAEAAAAlACADAAAAGAAgAQAAJAAwAgAAJQAgAwAAABgAIAEAACQAMAIAACUAIAMAAAAYACABAAAkADACAAAlACALAwAA9gMAIAsAAPUDACD_AQEAAAABhgJAAAAAAYcCQAAAAAGIAgEAAAABmAIIAAAAAZkCAQAAAAGaAgEAAAABnAIAAACcAgKdAgEAAAABARkAALcCACAJ_wEBAAAAAYYCQAAAAAGHAkAAAAABiAIBAAAAAZgCCAAAAAGZAgEAAAABmgIBAAAAAZwCAAAAnAICnQIBAAAAAQEZAAC5AgAwARkAALkCADALAwAA9AMAIAsAAPMDACD_AQEA3gMAIYYCQADiAwAhhwJAAOIDACGIAgEA3gMAIZgCCADxAwAhmQIBAN4DACGaAgEA3wMAIZwCAADyA5wCIp0CAQDeAwAhAgAAACUAIBkAALwCACAJ_wEBAN4DACGGAkAA4gMAIYcCQADiAwAhiAIBAN4DACGYAggA8QMAIZkCAQDeAwAhmgIBAN8DACGcAgAA8gOcAiKdAgEA3gMAIQIAAAAYACAZAAC-AgAgAgAAABgAIBkAAL4CACADAAAAJQAgIAAAtwIAICEAALwCACABAAAAJQAgAQAAABgAIAYHAADsAwAgJgAA7wMAICcAAO4DACCIAQAA7QMAIIkBAADwAwAgmgIAANoDACAM_AEAAJMDADD9AQAAxQIAEP4BAACTAwAw_wEBAPcCACGGAkAA-wIAIYcCQAD7AgAhiAIBAPcCACGYAggAlAMAIZkCAQCVAwAhmgIBAPgCACGcAgAAlgOcAiKdAgEA9wIAIQMAAAAYACABAADEAgAwJQAAxQIAIAMAAAAYACABAAAkADACAAAlACABAAAAHAAgAQAAABwAIAMAAAAaACABAAAbADACAAAcACADAAAAGgAgAQAAGwAwAgAAHAAgAwAAABoAIAEAABsAMAIAABwAIAgJAADrAwAg_wEBAAAAAYYCQAAAAAGHAkAAAAABiAIBAAAAAZQCAQAAAAGWAgAAAJYCA5cCAQAAAAEBGQAAzQIAIAf_AQEAAAABhgJAAAAAAYcCQAAAAAGIAgEAAAABlAIBAAAAAZYCAAAAlgIDlwIBAAAAAQEZAADPAgAwARkAAM8CADAICQAA6gMAIP8BAQDeAwAhhgJAAOIDACGHAkAA4gMAIYgCAQDeAwAhlAIBAN4DACGWAgAA6QOWAiOXAgEA3gMAIQIAAAAcACAZAADSAgAgB_8BAQDeAwAhhgJAAOIDACGHAkAA4gMAIYgCAQDeAwAhlAIBAN4DACGWAgAA6QOWAiOXAgEA3gMAIQIAAAAaACAZAADUAgAgAgAAABoAIBkAANQCACADAAAAHAAgIAAAzQIAICEAANICACABAAAAHAAgAQAAABoAIAQHAADmAwAgJgAA6AMAICcAAOcDACCWAgAA2gMAIAr8AQAAjwMAMP0BAADbAgAQ_gEAAI8DADD_AQEA9wIAIYYCQAD7AgAhhwJAAPsCACGIAgEA9wIAIZQCAQD3AgAhlgIAAJADlgIjlwIBAPcCACEDAAAAGgAgAQAA2gIAMCUAANsCACADAAAAGgAgAQAAGwAwAgAAHAAgDwMAAI4DACAKAQCKAwAh_AEAAIgDADD9AQAAKQAQ_gEAAIgDADD_AQEAAAABgAIBAIkDACGBAgEAAAABggIBAIoDACGDAgEAigMAIYQCIACLAwAhhQJAAIwDACGGAkAAjQMAIYcCQACNAwAhiAIBAAAAAQEAAADeAgAgAQAAAN4CACAFAwAA5QMAIAoAANoDACCCAgAA2gMAIIMCAADaAwAghQIAANoDACADAAAAKQAgAQAA4QIAMAIAAN4CACADAAAAKQAgAQAA4QIAMAIAAN4CACADAAAAKQAgAQAA4QIAMAIAAN4CACAMAwAA5AMAIAoBAAAAAf8BAQAAAAGAAgEAAAABgQIBAAAAAYICAQAAAAGDAgEAAAABhAIgAAAAAYUCQAAAAAGGAkAAAAABhwJAAAAAAYgCAQAAAAEBGQAA5QIAIAsKAQAAAAH_AQEAAAABgAIBAAAAAYECAQAAAAGCAgEAAAABgwIBAAAAAYQCIAAAAAGFAkAAAAABhgJAAAAAAYcCQAAAAAGIAgEAAAABARkAAOcCADABGQAA5wIAMAwDAADjAwAgCgEA3wMAIf8BAQDeAwAhgAIBAN4DACGBAgEA3gMAIYICAQDfAwAhgwIBAN8DACGEAiAA4AMAIYUCQADhAwAhhgJAAOIDACGHAkAA4gMAIYgCAQDeAwAhAgAAAN4CACAZAADqAgAgCwoBAN8DACH_AQEA3gMAIYACAQDeAwAhgQIBAN4DACGCAgEA3wMAIYMCAQDfAwAhhAIgAOADACGFAkAA4QMAIYYCQADiAwAhhwJAAOIDACGIAgEA3gMAIQIAAAApACAZAADsAgAgAgAAACkAIBkAAOwCACADAAAA3gIAICAAAOUCACAhAADqAgAgAQAAAN4CACABAAAAKQAgBwcAANsDACAKAADaAwAgJgAA3QMAICcAANwDACCCAgAA2gMAIIMCAADaAwAghQIAANoDACAOCgEA-AIAIfwBAAD2AgAw_QEAAPMCABD-AQAA9gIAMP8BAQD3AgAhgAIBAPcCACGBAgEA9wIAIYICAQD4AgAhgwIBAPgCACGEAiAA-QIAIYUCQAD6AgAhhgJAAPsCACGHAkAA-wIAIYgCAQD3AgAhAwAAACkAIAEAAPICADAlAADzAgAgAwAAACkAIAEAAOECADACAADeAgAgDgoBAPgCACH8AQAA9gIAMP0BAADzAgAQ_gEAAPYCADD_AQEA9wIAIYACAQD3AgAhgQIBAPcCACGCAgEA-AIAIYMCAQD4AgAhhAIgAPkCACGFAkAA-gIAIYYCQAD7AgAhhwJAAPsCACGIAgEA9wIAIQ4HAAD9AgAgJgAAhwMAICcAAIcDACCJAgEAAAABigIBAAAABIsCAQAAAASMAgEAAAABjQIBAAAAAY4CAQAAAAGPAgEAAAABkAIBAIYDACGRAgEAAAABkgIBAAAAAZMCAQAAAAEOBwAAgAMAICYAAIUDACAnAACFAwAgiQIBAAAAAYoCAQAAAAWLAgEAAAAFjAIBAAAAAY0CAQAAAAGOAgEAAAABjwIBAAAAAZACAQCEAwAhkQIBAAAAAZICAQAAAAGTAgEAAAABBQcAAP0CACAmAACDAwAgJwAAgwMAIIkCIAAAAAGQAiAAggMAIQsHAACAAwAgJgAAgQMAICcAAIEDACCJAkAAAAABigJAAAAABYsCQAAAAAWMAkAAAAABjQJAAAAAAY4CQAAAAAGPAkAAAAABkAJAAP8CACELBwAA_QIAICYAAP4CACAnAAD-AgAgiQJAAAAAAYoCQAAAAASLAkAAAAAEjAJAAAAAAY0CQAAAAAGOAkAAAAABjwJAAAAAAZACQAD8AgAhCwcAAP0CACAmAAD-AgAgJwAA_gIAIIkCQAAAAAGKAkAAAAAEiwJAAAAABIwCQAAAAAGNAkAAAAABjgJAAAAAAY8CQAAAAAGQAkAA_AIAIQiJAgIAAAABigICAAAABIsCAgAAAASMAgIAAAABjQICAAAAAY4CAgAAAAGPAgIAAAABkAICAP0CACEIiQJAAAAAAYoCQAAAAASLAkAAAAAEjAJAAAAAAY0CQAAAAAGOAkAAAAABjwJAAAAAAZACQAD-AgAhCwcAAIADACAmAACBAwAgJwAAgQMAIIkCQAAAAAGKAkAAAAAFiwJAAAAABYwCQAAAAAGNAkAAAAABjgJAAAAAAY8CQAAAAAGQAkAA_wIAIQiJAgIAAAABigICAAAABYsCAgAAAAWMAgIAAAABjQICAAAAAY4CAgAAAAGPAgIAAAABkAICAIADACEIiQJAAAAAAYoCQAAAAAWLAkAAAAAFjAJAAAAAAY0CQAAAAAGOAkAAAAABjwJAAAAAAZACQACBAwAhBQcAAP0CACAmAACDAwAgJwAAgwMAIIkCIAAAAAGQAiAAggMAIQKJAiAAAAABkAIgAIMDACEOBwAAgAMAICYAAIUDACAnAACFAwAgiQIBAAAAAYoCAQAAAAWLAgEAAAAFjAIBAAAAAY0CAQAAAAGOAgEAAAABjwIBAAAAAZACAQCEAwAhkQIBAAAAAZICAQAAAAGTAgEAAAABC4kCAQAAAAGKAgEAAAAFiwIBAAAABYwCAQAAAAGNAgEAAAABjgIBAAAAAY8CAQAAAAGQAgEAhQMAIZECAQAAAAGSAgEAAAABkwIBAAAAAQ4HAAD9AgAgJgAAhwMAICcAAIcDACCJAgEAAAABigIBAAAABIsCAQAAAASMAgEAAAABjQIBAAAAAY4CAQAAAAGPAgEAAAABkAIBAIYDACGRAgEAAAABkgIBAAAAAZMCAQAAAAELiQIBAAAAAYoCAQAAAASLAgEAAAAEjAIBAAAAAY0CAQAAAAGOAgEAAAABjwIBAAAAAZACAQCHAwAhkQIBAAAAAZICAQAAAAGTAgEAAAABDwMAAI4DACAKAQCKAwAh_AEAAIgDADD9AQAAKQAQ_gEAAIgDADD_AQEAiQMAIYACAQCJAwAhgQIBAIkDACGCAgEAigMAIYMCAQCKAwAhhAIgAIsDACGFAkAAjAMAIYYCQACNAwAhhwJAAI0DACGIAgEAiQMAIQuJAgEAAAABigIBAAAABIsCAQAAAASMAgEAAAABjQIBAAAAAY4CAQAAAAGPAgEAAAABkAIBAIcDACGRAgEAAAABkgIBAAAAAZMCAQAAAAELiQIBAAAAAYoCAQAAAAWLAgEAAAAFjAIBAAAAAY0CAQAAAAGOAgEAAAABjwIBAAAAAZACAQCFAwAhkQIBAAAAAZICAQAAAAGTAgEAAAABAokCIAAAAAGQAiAAgwMAIQiJAkAAAAABigJAAAAABYsCQAAAAAWMAkAAAAABjQJAAAAAAY4CQAAAAAGPAkAAAAABkAJAAIEDACEIiQJAAAAAAYoCQAAAAASLAkAAAAAEjAJAAAAAAY0CQAAAAAGOAkAAAAABjwJAAAAAAZACQAD-AgAhGQQAALcDACAFAAC4AwAgCgAAugMAIA8AALkDACAQAAC7AwAgEQAAvAMAIBIAAL0DACATAAC-AwAg_AEAALQDADD9AQAAZAAQ_gEAALQDADD_AQEAiQMAIYACAQCJAwAhgQIBAIkDACGEAiAAiwMAIYUCQACMAwAhhgJAAI0DACGHAkAAjQMAIboCIACLAwAhuwIgAIsDACG8AgEAigMAIb4CAAC1A74CI8ACAAC2A8ACI8oCAABkACDLAgAAZAAgCvwBAACPAwAw_QEAANsCABD-AQAAjwMAMP8BAQD3AgAhhgJAAPsCACGHAkAA-wIAIYgCAQD3AgAhlAIBAPcCACGWAgAAkAOWAiOXAgEA9wIAIQcHAACAAwAgJgAAkgMAICcAAJIDACCJAgAAAJYCA4oCAAAAlgIJiwIAAACWAgmQAgAAkQOWAiMHBwAAgAMAICYAAJIDACAnAACSAwAgiQIAAACWAgOKAgAAAJYCCYsCAAAAlgIJkAIAAJEDlgIjBIkCAAAAlgIDigIAAACWAgmLAgAAAJYCCZACAACSA5YCIwz8AQAAkwMAMP0BAADFAgAQ_gEAAJMDADD_AQEA9wIAIYYCQAD7AgAhhwJAAPsCACGIAgEA9wIAIZgCCACUAwAhmQIBAJUDACGaAgEA-AIAIZwCAACWA5wCIp0CAQD3AgAhDQcAAP0CACAmAACbAwAgJwAAmwMAIIgBAACbAwAgiQEAAJsDACCJAggAAAABigIIAAAABIsCCAAAAASMAggAAAABjQIIAAAAAY4CCAAAAAGPAggAAAABkAIIAJoDACELBwAA_QIAICYAAIcDACAnAACHAwAgiQIBAAAAAYoCAQAAAASLAgEAAAAEjAIBAAAAAY0CAQAAAAGOAgEAAAABjwIBAAAAAZACAQCZAwAhBwcAAP0CACAmAACYAwAgJwAAmAMAIIkCAAAAnAICigIAAACcAgiLAgAAAJwCCJACAACXA5wCIgcHAAD9AgAgJgAAmAMAICcAAJgDACCJAgAAAJwCAooCAAAAnAIIiwIAAACcAgiQAgAAlwOcAiIEiQIAAACcAgKKAgAAAJwCCIsCAAAAnAIIkAIAAJgDnAIiCwcAAP0CACAmAACHAwAgJwAAhwMAIIkCAQAAAAGKAgEAAAAEiwIBAAAABIwCAQAAAAGNAgEAAAABjgIBAAAAAY8CAQAAAAGQAgEAmQMAIQ0HAAD9AgAgJgAAmwMAICcAAJsDACCIAQAAmwMAIIkBAACbAwAgiQIIAAAAAYoCCAAAAASLAggAAAAEjAIIAAAAAY0CCAAAAAGOAggAAAABjwIIAAAAAZACCACaAwAhCIkCCAAAAAGKAggAAAAEiwIIAAAABIwCCAAAAAGNAggAAAABjgIIAAAAAY8CCAAAAAGQAggAmwMAIQz8AQAAnAMAMP0BAACvAgAQ_gEAAJwDADD_AQEA9wIAIYYCQAD7AgAhiAIBAPcCACGUAgEA9wIAIZ4CAgCdAwAhnwICAJ0DACGgAgEA9wIAIaICAACeA6ICIqMCAACWA5wCIg0HAAD9AgAgJgAA_QIAICcAAP0CACCIAQAAmwMAIIkBAAD9AgAgiQICAAAAAYoCAgAAAASLAgIAAAAEjAICAAAAAY0CAgAAAAGOAgIAAAABjwICAAAAAZACAgChAwAhBwcAAP0CACAmAACgAwAgJwAAoAMAIIkCAAAAogICigIAAACiAgiLAgAAAKICCJACAACfA6ICIgcHAAD9AgAgJgAAoAMAICcAAKADACCJAgAAAKICAooCAAAAogIIiwIAAACiAgiQAgAAnwOiAiIEiQIAAACiAgKKAgAAAKICCIsCAAAAogIIkAIAAKADogIiDQcAAP0CACAmAAD9AgAgJwAA_QIAIIgBAACbAwAgiQEAAP0CACCJAgIAAAABigICAAAABIsCAgAAAASMAgIAAAABjQICAAAAAY4CAgAAAAGPAgIAAAABkAICAKEDACEL_AEAAKIDADD9AQAAmQIAEP4BAACiAwAw_wEBAPcCACGAAgEA9wIAIYYCQAD7AgAhhwJAAPsCACGkAgIAnQMAIaUCAgCdAwAhpgIBAPcCACGnAgEA9wIAIQ4KAQD4AgAh_AEAAKMDADD9AQAAgwIAEP4BAACjAwAw_wEBAPcCACGAAgEA9wIAIYECAQD3AgAhggIBAPgCACGDAgEA-AIAIYQCIAD5AgAhhQJAAPoCACGGAkAA-wIAIYcCQAD7AgAhiAIBAPcCACEPAwAAjgMAIAoBAIoDACH8AQAApAMAMP0BAAAnABD-AQAApAMAMP8BAQCJAwAhgAIBAIkDACGBAgEAiQMAIYICAQCKAwAhgwIBAIoDACGEAiAAiwMAIYUCQACMAwAhhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhBvwBAAClAwAw_QEAAOsBABD-AQAApQMAMP8BAQD3AgAhlwIBAPgCACGnAgEA9wIAIQcGAACnAwAg_AEAAKYDADD9AQAA2AEAEP4BAACmAwAw_wEBAIkDACGXAgEAigMAIacCAQCJAwAhA6gCAAAPACCpAgAADwAgqgIAAA8AIAn8AQAAqAMAMP0BAADSAQAQ_gEAAKgDADD_AQEA9wIAIYYCQAD7AgAhhwJAAPsCACGIAgEA9wIAIZQCAQD3AgAhnwICAJ0DACEJ_AEAAKkDADD9AQAAvAEAEP4BAACpAwAw_wEBAPcCACGGAkAA-wIAIYcCQAD7AgAhqwIBAPcCACGsAgEA9wIAIa0CQAD7AgAhCfwBAACqAwAw_QEAAKkBABD-AQAAqgMAMP8BAQCJAwAhhgJAAI0DACGHAkAAjQMAIasCAQCJAwAhrAIBAIkDACGtAkAAjQMAIRD8AQAAqwMAMP0BAACjAQAQ_gEAAKsDADD_AQEA9wIAIYYCQAD7AgAhhwJAAPsCACGIAgEA9wIAIa4CAQD3AgAhrwIBAPcCACGwAgEA-AIAIbECAQD4AgAhsgIBAPgCACGzAkAA-gIAIbQCQAD6AgAhtQIBAPgCACG2AgEA-AIAIQv8AQAArAMAMP0BAACNAQAQ_gEAAKwDADD_AQEA9wIAIYYCQAD7AgAhhwJAAPsCACGIAgEA9wIAIa0CQAD7AgAhtwIBAPcCACG4AgEA-AIAIbkCAQD4AgAhD_wBAACtAwAw_QEAAHcAEP4BAACtAwAw_wEBAPcCACGAAgEA9wIAIYECAQD3AgAhhAIgAPkCACGFAkAA-gIAIYYCQAD7AgAhhwJAAPsCACG6AiAA-QIAIbsCIAD5AgAhvAIBAPgCACG-AgAArgO-AiPAAgAArwPAAiMHBwAAgAMAICYAALMDACAnAACzAwAgiQIAAAC-AgOKAgAAAL4CCYsCAAAAvgIJkAIAALIDvgIjBwcAAIADACAmAACxAwAgJwAAsQMAIIkCAAAAwAIDigIAAADAAgmLAgAAAMACCZACAACwA8ACIwcHAACAAwAgJgAAsQMAICcAALEDACCJAgAAAMACA4oCAAAAwAIJiwIAAADAAgmQAgAAsAPAAiMEiQIAAADAAgOKAgAAAMACCYsCAAAAwAIJkAIAALEDwAIjBwcAAIADACAmAACzAwAgJwAAswMAIIkCAAAAvgIDigIAAAC-AgmLAgAAAL4CCZACAACyA74CIwSJAgAAAL4CA4oCAAAAvgIJiwIAAAC-AgmQAgAAswO-AiMXBAAAtwMAIAUAALgDACAKAAC6AwAgDwAAuQMAIBAAALsDACARAAC8AwAgEgAAvQMAIBMAAL4DACD8AQAAtAMAMP0BAABkABD-AQAAtAMAMP8BAQCJAwAhgAIBAIkDACGBAgEAiQMAIYQCIACLAwAhhQJAAIwDACGGAkAAjQMAIYcCQACNAwAhugIgAIsDACG7AiAAiwMAIbwCAQCKAwAhvgIAALUDvgIjwAIAALYDwAIjBIkCAAAAvgIDigIAAAC-AgmLAgAAAL4CCZACAACzA74CIwSJAgAAAMACA4oCAAAAwAIJiwIAAADAAgmQAgAAsQPAAiMDqAIAAAMAIKkCAAADACCqAgAAAwAgA6gCAAAHACCpAgAABwAgqgIAAAcAIAOoAgAACwAgqQIAAAsAIKoCAAALACASAwAAjgMAIA0AAMcDACD8AQAAxgMAMP0BAAAiABD-AQAAxgMAMP8BAQCJAwAhhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhwQIBAIkDACHCAgEAiQMAIcMCAQCJAwAhxAIBAIoDACHFAgEAigMAIcYCAQCKAwAhxwIBAIoDACHKAgAAIgAgywIAACIAIAOoAgAAGAAgqQIAABgAIKoCAAAYACARAwAAjgMAIAoBAIoDACH8AQAApAMAMP0BAAAnABD-AQAApAMAMP8BAQCJAwAhgAIBAIkDACGBAgEAiQMAIYICAQCKAwAhgwIBAIoDACGEAiAAiwMAIYUCQACMAwAhhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhygIAACcAIMsCAAAnACARAwAAjgMAIAoBAIoDACH8AQAAiAMAMP0BAAApABD-AQAAiAMAMP8BAQCJAwAhgAIBAIkDACGBAgEAiQMAIYICAQCKAwAhgwIBAIoDACGEAiAAiwMAIYUCQACMAwAhhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhygIAACkAIMsCAAApACAQAwAAjgMAIPwBAADAAwAw_QEAACsAEP4BAADAAwAw_wEBAIkDACGAAgEAiQMAIYECAQCJAwAhggIBAIoDACGDAgEAigMAIYQCIACLAwAhhQJAAIwDACGGAkAAjQMAIYcCQACNAwAhiAIBAIkDACHKAgAAKwAgywIAACsAIA38AQAAvwMAMP0BAABeABD-AQAAvwMAMP8BAQD3AgAhgAIBAPcCACGBAgEA9wIAIYICAQD4AgAhgwIBAPgCACGEAiAA-QIAIYUCQAD6AgAhhgJAAPsCACGHAkAA-wIAIYgCAQD3AgAhDgMAAI4DACD8AQAAwAMAMP0BAAArABD-AQAAwAMAMP8BAQCJAwAhgAIBAIkDACGBAgEAiQMAIYICAQCKAwAhgwIBAIoDACGEAiAAiwMAIYUCQACMAwAhhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhDvwBAADBAwAw_QEAAEYAEP4BAADBAwAw_wEBAPcCACGGAkAA-wIAIYcCQAD7AgAhiAIBAPcCACHBAgEA9wIAIcICAQD3AgAhwwIBAPcCACHEAgEA-AIAIcUCAQD4AgAhxgIBAPgCACHHAgEA-AIAIQ4DAACOAwAgCwAAxQMAIPwBAADCAwAw_QEAABgAEP4BAADCAwAw_wEBAIkDACGGAkAAjQMAIYcCQACNAwAhiAIBAIkDACGYAggAwwMAIZkCAQDLAwAhmgIBAIoDACGcAgAAxAOcAiKdAgEAiQMAIQiJAggAAAABigIIAAAABIsCCAAAAASMAggAAAABjQIIAAAAAY4CCAAAAAGPAggAAAABkAIIAJsDACEEiQIAAACcAgKKAgAAAJwCCIsCAAAAnAIIkAIAAJgDnAIiEQkAAMoDACAKAADQAwAgDAAA0QMAIPwBAADNAwAw_QEAABQAEP4BAADNAwAw_wEBAIkDACGGAkAAjQMAIYgCAQCJAwAhlAIBAIkDACGeAgIAzgMAIZ8CAgDOAwAhoAIBAIkDACGiAgAAzwOiAiKjAgAAxAOcAiLKAgAAFAAgywIAABQAIBADAACOAwAgDQAAxwMAIPwBAADGAwAw_QEAACIAEP4BAADGAwAw_wEBAIkDACGGAkAAjQMAIYcCQACNAwAhiAIBAIkDACHBAgEAiQMAIcICAQCJAwAhwwIBAIkDACHEAgEAigMAIcUCAQCKAwAhxgIBAIoDACHHAgEAigMAIQOoAgAAFAAgqQIAABQAIKoCAAAUACALCQAAygMAIPwBAADIAwAw_QEAABoAEP4BAADIAwAw_wEBAIkDACGGAkAAjQMAIYcCQACNAwAhiAIBAIkDACGUAgEAiQMAIZYCAADJA5YCI5cCAQCJAwAhBIkCAAAAlgIDigIAAACWAgmLAgAAAJYCCZACAACSA5YCIxEIAADTAwAgDQAAxwMAIA4AANQDACAPAAC5AwAg_AEAANIDADD9AQAADwAQ_gEAANIDADD_AQEAiQMAIYACAQCJAwAhhgJAAI0DACGHAkAAjQMAIaQCAgDOAwAhpQICAM4DACGmAgEAiQMAIacCAQCJAwAhygIAAA8AIMsCAAAPACAIiQIBAAAAAYoCAQAAAASLAgEAAAAEjAIBAAAAAY0CAQAAAAGOAgEAAAABjwIBAAAAAZACAQDMAwAhCIkCAQAAAAGKAgEAAAAEiwIBAAAABIwCAQAAAAGNAgEAAAABjgIBAAAAAY8CAQAAAAGQAgEAzAMAIQ8JAADKAwAgCgAA0AMAIAwAANEDACD8AQAAzQMAMP0BAAAUABD-AQAAzQMAMP8BAQCJAwAhhgJAAI0DACGIAgEAiQMAIZQCAQCJAwAhngICAM4DACGfAgIAzgMAIaACAQCJAwAhogIAAM8DogIiowIAAMQDnAIiCIkCAgAAAAGKAgIAAAAEiwICAAAABIwCAgAAAAGNAgIAAAABjgICAAAAAY8CAgAAAAGQAgIA_QIAIQSJAgAAAKICAooCAAAAogIIiwIAAACiAgiQAgAAoAOiAiISAwAAjgMAIA0AAMcDACD8AQAAxgMAMP0BAAAiABD-AQAAxgMAMP8BAQCJAwAhhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhwQIBAIkDACHCAgEAiQMAIcMCAQCJAwAhxAIBAIoDACHFAgEAigMAIcYCAQCKAwAhxwIBAIoDACHKAgAAIgAgywIAACIAIBADAACOAwAgCwAAxQMAIPwBAADCAwAw_QEAABgAEP4BAADCAwAw_wEBAIkDACGGAkAAjQMAIYcCQACNAwAhiAIBAIkDACGYAggAwwMAIZkCAQDLAwAhmgIBAIoDACGcAgAAxAOcAiKdAgEAiQMAIcoCAAAYACDLAgAAGAAgDwgAANMDACANAADHAwAgDgAA1AMAIA8AALkDACD8AQAA0gMAMP0BAAAPABD-AQAA0gMAMP8BAQCJAwAhgAIBAIkDACGGAkAAjQMAIYcCQACNAwAhpAICAM4DACGlAgIAzgMAIaYCAQCJAwAhpwIBAIkDACEJBgAApwMAIPwBAACmAwAw_QEAANgBABD-AQAApgMAMP8BAQCJAwAhlwIBAIoDACGnAgEAiQMAIcoCAADYAQAgywIAANgBACADqAIAABoAIKkCAAAaACCqAgAAGgAgAogCAQAAAAGUAgEAAAABCwMAAI4DACAJAADKAwAg_AEAANYDADD9AQAACwAQ_gEAANYDADD_AQEAiQMAIYYCQACNAwAhhwJAAI0DACGIAgEAiQMAIZQCAQCJAwAhnwICAM4DACERAwAAjgMAIPwBAADXAwAw_QEAAAcAEP4BAADXAwAw_wEBAIkDACGGAkAAjQMAIYcCQACNAwAhiAIBAIkDACGuAgEAiQMAIa8CAQCJAwAhsAIBAIoDACGxAgEAigMAIbICAQCKAwAhswJAAIwDACG0AkAAjAMAIbUCAQCKAwAhtgIBAIoDACEMAwAAjgMAIPwBAADYAwAw_QEAAAMAEP4BAADYAwAw_wEBAIkDACGGAkAAjQMAIYcCQACNAwAhiAIBAIkDACGtAkAAjQMAIbcCAQCJAwAhuAIBAIoDACG5AgEAigMAIQL_AQEAAAABiAIBAAAAAQAAAAAB0gIBAAAAAQHSAgEAAAABAdICIAAAAAEB0gJAAAAAAQHSAkAAAAABBSAAAKoGACAhAACtBgAgzAIAAKsGACDNAgAArAYAINACAABhACADIAAAqgYAIMwCAACrBgAg0AIAAGEAIAwEAADIBQAgBQAAyQUAIAoAAMsFACAPAADKBQAgEAAAzAUAIBEAAM0FACASAADOBQAgEwAAzwUAIIUCAADaAwAgvAIAANoDACC-AgAA2gMAIMACAADaAwAgAAAAAdICAAAAlgIDBSAAAKUGACAhAACoBgAgzAIAAKYGACDNAgAApwYAINACAAARACADIAAApQYAIMwCAACmBgAg0AIAABEAIAAAAAAABdICCAAAAAHVAggAAAAB1gIIAAAAAdcCCAAAAAHYAggAAAABAdICAAAAnAICBSAAAJ0GACAhAACjBgAgzAIAAJ4GACDNAgAAogYAINACAAAWACAFIAAAmwYAICEAAKAGACDMAgAAnAYAIM0CAACfBgAg0AIAAGEAIAMgAACdBgAgzAIAAJ4GACDQAgAAFgAgAyAAAJsGACDMAgAAnAYAINACAABhACAAAAAAAAXSAgIAAAAB1QICAAAAAdYCAgAAAAHXAgIAAAAB2AICAAAAAQHSAgAAAKICAgUgAACTBgAgIQAAmQYAIMwCAACUBgAgzQIAAJgGACDQAgAAEQAgBSAAAJEGACAhAACWBgAgzAIAAJIGACDNAgAAlQYAINACAAABACAHIAAAgQQAICEAAIQEACDMAgAAggQAIM0CAACDBAAgzgIAABgAIM8CAAAYACDQAgAAJQAgCQMAAPYDACD_AQEAAAABhgJAAAAAAYcCQAAAAAGIAgEAAAABmAIIAAAAAZkCAQAAAAGaAgEAAAABnAIAAACcAgICAAAAJQAgIAAAgQQAIAMAAAAYACAgAACBBAAgIQAAhQQAIAsAAAAYACADAAD0AwAgGQAAhQQAIP8BAQDeAwAhhgJAAOIDACGHAkAA4gMAIYgCAQDeAwAhmAIIAPEDACGZAgEA3gMAIZoCAQDfAwAhnAIAAPIDnAIiCQMAAPQDACD_AQEA3gMAIYYCQADiAwAhhwJAAOIDACGIAgEA3gMAIZgCCADxAwAhmQIBAN4DACGaAgEA3wMAIZwCAADyA5wCIgMgAACTBgAgzAIAAJQGACDQAgAAEQAgAyAAAJEGACDMAgAAkgYAINACAAABACADIAAAgQQAIMwCAACCBAAg0AIAACUAIAAAAAAABSAAAIQGACAhAACPBgAgzAIAAIUGACDNAgAAjgYAINACAADVAQAgCyAAAKwEADAhAACxBAAwzAIAAK0EADDNAgAArgQAMM4CAACwBAAwzwIAALAEADDQAgAAsAQAMNECAACvBAAg0gIAALAEADDTAgAAsgQAMNQCAACzBAAwCyAAAKAEADAhAAClBAAwzAIAAKEEADDNAgAAogQAMM4CAACkBAAwzwIAAKQEADDQAgAApAQAMNECAACjBAAg0gIAAKQEADDTAgAApgQAMNQCAACnBAAwCyAAAJIEADAhAACXBAAwzAIAAJMEADDNAgAAlAQAMM4CAACWBAAwzwIAAJYEADDQAgAAlgQAMNECAACVBAAg0gIAAJYEADDTAgAAmAQAMNQCAACZBAAwBgMAAJ8EACD_AQEAAAABhgJAAAAAAYcCQAAAAAGIAgEAAAABnwICAAAAAQIAAAANACAgAACeBAAgAwAAAA0AICAAAJ4EACAhAACcBAAgARkAAI0GADAMAwAAjgMAIAkAAMoDACD8AQAA1gMAMP0BAAALABD-AQAA1gMAMP8BAQAAAAGGAkAAjQMAIYcCQACNAwAhiAIBAIkDACGUAgEAiQMAIZ8CAgDOAwAhyAIAANUDACACAAAADQAgGQAAnAQAIAIAAACaBAAgGQAAmwQAIAn8AQAAmQQAMP0BAACaBAAQ_gEAAJkEADD_AQEAiQMAIYYCQACNAwAhhwJAAI0DACGIAgEAiQMAIZQCAQCJAwAhnwICAM4DACEJ_AEAAJkEADD9AQAAmgQAEP4BAACZBAAw_wEBAIkDACGGAkAAjQMAIYcCQACNAwAhiAIBAIkDACGUAgEAiQMAIZ8CAgDOAwAhBf8BAQDeAwAhhgJAAOIDACGHAkAA4gMAIYgCAQDeAwAhnwICAPwDACEGAwAAnQQAIP8BAQDeAwAhhgJAAOIDACGHAkAA4gMAIYgCAQDeAwAhnwICAPwDACEFIAAAiAYAICEAAIsGACDMAgAAiQYAIM0CAACKBgAg0AIAAGEAIAYDAACfBAAg_wEBAAAAAYYCQAAAAAGHAkAAAAABiAIBAAAAAZ8CAgAAAAEDIAAAiAYAIMwCAACJBgAg0AIAAGEAIAb_AQEAAAABhgJAAAAAAYcCQAAAAAGIAgEAAAABlgIAAACWAgOXAgEAAAABAgAAABwAICAAAKsEACADAAAAHAAgIAAAqwQAICEAAKoEACABGQAAhwYAMAsJAADKAwAg_AEAAMgDADD9AQAAGgAQ_gEAAMgDADD_AQEAAAABhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhlAIBAIkDACGWAgAAyQOWAiOXAgEAiQMAIQIAAAAcACAZAACqBAAgAgAAAKgEACAZAACpBAAgCvwBAACnBAAw_QEAAKgEABD-AQAApwQAMP8BAQCJAwAhhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhlAIBAIkDACGWAgAAyQOWAiOXAgEAiQMAIQr8AQAApwQAMP0BAACoBAAQ_gEAAKcEADD_AQEAiQMAIYYCQACNAwAhhwJAAI0DACGIAgEAiQMAIZQCAQCJAwAhlgIAAMkDlgIjlwIBAIkDACEG_wEBAN4DACGGAkAA4gMAIYcCQADiAwAhiAIBAN4DACGWAgAA6QOWAiOXAgEA3gMAIQb_AQEA3gMAIYYCQADiAwAhhwJAAOIDACGIAgEA3gMAIZYCAADpA5YCI5cCAQDeAwAhBv8BAQAAAAGGAkAAAAABhwJAAAAAAYgCAQAAAAGWAgAAAJYCA5cCAQAAAAEKCgAAhwQAIAwAAIgEACD_AQEAAAABhgJAAAAAAYgCAQAAAAGeAgIAAAABnwICAAAAAaACAQAAAAGiAgAAAKICAqMCAAAAnAICAgAAABYAICAAALcEACADAAAAFgAgIAAAtwQAICEAALYEACABGQAAhgYAMA8JAADKAwAgCgAA0AMAIAwAANEDACD8AQAAzQMAMP0BAAAUABD-AQAAzQMAMP8BAQAAAAGGAkAAjQMAIYgCAQCJAwAhlAIBAIkDACGeAgIAzgMAIZ8CAgDOAwAhoAIBAIkDACGiAgAAzwOiAiKjAgAAxAOcAiICAAAAFgAgGQAAtgQAIAIAAAC0BAAgGQAAtQQAIAz8AQAAswQAMP0BAAC0BAAQ_gEAALMEADD_AQEAiQMAIYYCQACNAwAhiAIBAIkDACGUAgEAiQMAIZ4CAgDOAwAhnwICAM4DACGgAgEAiQMAIaICAADPA6ICIqMCAADEA5wCIgz8AQAAswQAMP0BAAC0BAAQ_gEAALMEADD_AQEAiQMAIYYCQACNAwAhiAIBAIkDACGUAgEAiQMAIZ4CAgDOAwAhnwICAM4DACGgAgEAiQMAIaICAADPA6ICIqMCAADEA5wCIgj_AQEA3gMAIYYCQADiAwAhiAIBAN4DACGeAgIA_AMAIZ8CAgD8AwAhoAIBAN4DACGiAgAA_QOiAiKjAgAA8gOcAiIKCgAA_wMAIAwAAIAEACD_AQEA3gMAIYYCQADiAwAhiAIBAN4DACGeAgIA_AMAIZ8CAgD8AwAhoAIBAN4DACGiAgAA_QOiAiKjAgAA8gOcAiIKCgAAhwQAIAwAAIgEACD_AQEAAAABhgJAAAAAAYgCAQAAAAGeAgIAAAABnwICAAAAAaACAQAAAAGiAgAAAKICAqMCAAAAnAICAyAAAIQGACDMAgAAhQYAINACAADVAQAgBCAAAKwEADDMAgAArQQAMNACAACwBAAw0QIAAK8EACAEIAAAoAQAMMwCAAChBAAw0AIAAKQEADDRAgAAowQAIAQgAACSBAAwzAIAAJMEADDQAgAAlgQAMNECAACVBAAgAAAABSAAAP8FACAhAACCBgAgzAIAAIAGACDNAgAAgQYAINACAABhACADIAAA_wUAIMwCAACABgAg0AIAAGEAIAAAAAsgAADFBAAwIQAAygQAMMwCAADGBAAwzQIAAMcEADDOAgAAyQQAMM8CAADJBAAw0AIAAMkEADDRAgAAyAQAINICAADJBAAw0wIAAMsEADDUAgAAzAQAMAoNAAC5BAAgDgAAugQAIA8AALsEACD_AQEAAAABgAIBAAAAAYYCQAAAAAGHAkAAAAABpAICAAAAAaUCAgAAAAGnAgEAAAABAgAAABEAICAAANAEACADAAAAEQAgIAAA0AQAICEAAM8EACABGQAA_gUAMA8IAADTAwAgDQAAxwMAIA4AANQDACAPAAC5AwAg_AEAANIDADD9AQAADwAQ_gEAANIDADD_AQEAAAABgAIBAAAAAYYCQACNAwAhhwJAAI0DACGkAgIAzgMAIaUCAgDOAwAhpgIBAIkDACGnAgEAiQMAIQIAAAARACAZAADPBAAgAgAAAM0EACAZAADOBAAgC_wBAADMBAAw_QEAAM0EABD-AQAAzAQAMP8BAQCJAwAhgAIBAIkDACGGAkAAjQMAIYcCQACNAwAhpAICAM4DACGlAgIAzgMAIaYCAQCJAwAhpwIBAIkDACEL_AEAAMwEADD9AQAAzQQAEP4BAADMBAAw_wEBAIkDACGAAgEAiQMAIYYCQACNAwAhhwJAAI0DACGkAgIAzgMAIaUCAgDOAwAhpgIBAIkDACGnAgEAiQMAIQf_AQEA3gMAIYACAQDeAwAhhgJAAOIDACGHAkAA4gMAIaQCAgD8AwAhpQICAPwDACGnAgEA3gMAIQoNAACPBAAgDgAAkAQAIA8AAJEEACD_AQEA3gMAIYACAQDeAwAhhgJAAOIDACGHAkAA4gMAIaQCAgD8AwAhpQICAPwDACGnAgEA3gMAIQoNAAC5BAAgDgAAugQAIA8AALsEACD_AQEAAAABgAIBAAAAAYYCQAAAAAGHAkAAAAABpAICAAAAAaUCAgAAAAGnAgEAAAABBCAAAMUEADDMAgAAxgQAMNACAADJBAAw0QIAAMgEACAAAAAAAAAFIAAA-QUAICEAAPwFACDMAgAA-gUAIM0CAAD7BQAg0AIAABEAIAMgAAD5BQAgzAIAAPoFACDQAgAAEQAgAAAAAAAABSAAAPQFACAhAAD3BQAgzAIAAPUFACDNAgAA9gUAINACAABhACADIAAA9AUAIMwCAAD1BQAg0AIAAGEAIAAAAAUgAADvBQAgIQAA8gUAIMwCAADwBQAgzQIAAPEFACDQAgAAYQAgAyAAAO8FACDMAgAA8AUAINACAABhACAAAAAB0gIAAAC-AgMB0gIAAADAAgMLIAAAtAUAMCEAALkFADDMAgAAtQUAMM0CAAC2BQAwzgIAALgFADDPAgAAuAUAMNACAAC4BQAw0QIAALcFACDSAgAAuAUAMNMCAAC6BQAw1AIAALsFADALIAAAqAUAMCEAAK0FADDMAgAAqQUAMM0CAACqBQAwzgIAAKwFADDPAgAArAUAMNACAACsBQAw0QIAAKsFACDSAgAArAUAMNMCAACuBQAw1AIAAK8FADALIAAAnwUAMCEAAKMFADDMAgAAoAUAMM0CAAChBQAwzgIAAJYEADDPAgAAlgQAMNACAACWBAAw0QIAAKIFACDSAgAAlgQAMNMCAACkBQAw1AIAAJkEADAHIAAAjwUAICEAAJIFACDMAgAAkAUAIM0CAACRBQAgzgIAACIAIM8CAAAiACDQAgAAAQAgCyAAAIMFADAhAACIBQAwzAIAAIQFADDNAgAAhQUAMM4CAACHBQAwzwIAAIcFADDQAgAAhwUAMNECAACGBQAg0gIAAIcFADDTAgAAiQUAMNQCAACKBQAwByAAAP4EACAhAACBBQAgzAIAAP8EACDNAgAAgAUAIM4CAAAnACDPAgAAJwAg0AIAAO4BACAHIAAA-QQAICEAAPwEACDMAgAA-gQAIM0CAAD7BAAgzgIAACkAIM8CAAApACDQAgAA3gIAIAcgAAD0BAAgIQAA9wQAIMwCAAD1BAAgzQIAAPYEACDOAgAAKwAgzwIAACsAINACAABJACAJ_wEBAAAAAYACAQAAAAGBAgEAAAABggIBAAAAAYMCAQAAAAGEAiAAAAABhQJAAAAAAYYCQAAAAAGHAkAAAAABAgAAAEkAICAAAPQEACADAAAAKwAgIAAA9AQAICEAAPgEACALAAAAKwAgGQAA-AQAIP8BAQDeAwAhgAIBAN4DACGBAgEA3gMAIYICAQDfAwAhgwIBAN8DACGEAiAA4AMAIYUCQADhAwAhhgJAAOIDACGHAkAA4gMAIQn_AQEA3gMAIYACAQDeAwAhgQIBAN4DACGCAgEA3wMAIYMCAQDfAwAhhAIgAOADACGFAkAA4QMAIYYCQADiAwAhhwJAAOIDACEKCgEAAAAB_wEBAAAAAYACAQAAAAGBAgEAAAABggIBAAAAAYMCAQAAAAGEAiAAAAABhQJAAAAAAYYCQAAAAAGHAkAAAAABAgAAAN4CACAgAAD5BAAgAwAAACkAICAAAPkEACAhAAD9BAAgDAAAACkAIAoBAN8DACEZAAD9BAAg_wEBAN4DACGAAgEA3gMAIYECAQDeAwAhggIBAN8DACGDAgEA3wMAIYQCIADgAwAhhQJAAOEDACGGAkAA4gMAIYcCQADiAwAhCgoBAN8DACH_AQEA3gMAIYACAQDeAwAhgQIBAN4DACGCAgEA3wMAIYMCAQDfAwAhhAIgAOADACGFAkAA4QMAIYYCQADiAwAhhwJAAOIDACEKCgEAAAAB_wEBAAAAAYACAQAAAAGBAgEAAAABggIBAAAAAYMCAQAAAAGEAiAAAAABhQJAAAAAAYYCQAAAAAGHAkAAAAABAgAAAO4BACAgAAD-BAAgAwAAACcAICAAAP4EACAhAACCBQAgDAAAACcAIAoBAN8DACEZAACCBQAg_wEBAN4DACGAAgEA3gMAIYECAQDeAwAhggIBAN8DACGDAgEA3wMAIYQCIADgAwAhhQJAAOEDACGGAkAA4gMAIYcCQADiAwAhCgoBAN8DACH_AQEA3gMAIYACAQDeAwAhgQIBAN4DACGCAgEA3wMAIYMCAQDfAwAhhAIgAOADACGFAkAA4QMAIYYCQADiAwAhhwJAAOIDACEJCwAA9QMAIP8BAQAAAAGGAkAAAAABhwJAAAAAAZgCCAAAAAGZAgEAAAABmgIBAAAAAZwCAAAAnAICnQIBAAAAAQIAAAAlACAgAACOBQAgAwAAACUAICAAAI4FACAhAACNBQAgARkAAO4FADAOAwAAjgMAIAsAAMUDACD8AQAAwgMAMP0BAAAYABD-AQAAwgMAMP8BAQAAAAGGAkAAjQMAIYcCQACNAwAhiAIBAIkDACGYAggAwwMAIZkCAQAAAAGaAgEAAAABnAIAAMQDnAIinQIBAAAAAQIAAAAlACAZAACNBQAgAgAAAIsFACAZAACMBQAgDPwBAACKBQAw_QEAAIsFABD-AQAAigUAMP8BAQCJAwAhhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhmAIIAMMDACGZAgEAywMAIZoCAQCKAwAhnAIAAMQDnAIinQIBAIkDACEM_AEAAIoFADD9AQAAiwUAEP4BAACKBQAw_wEBAIkDACGGAkAAjQMAIYcCQACNAwAhiAIBAIkDACGYAggAwwMAIZkCAQDLAwAhmgIBAIoDACGcAgAAxAOcAiKdAgEAiQMAIQj_AQEA3gMAIYYCQADiAwAhhwJAAOIDACGYAggA8QMAIZkCAQDeAwAhmgIBAN8DACGcAgAA8gOcAiKdAgEA3gMAIQkLAADzAwAg_wEBAN4DACGGAkAA4gMAIYcCQADiAwAhmAIIAPEDACGZAgEA3gMAIZoCAQDfAwAhnAIAAPIDnAIinQIBAN4DACEJCwAA9QMAIP8BAQAAAAGGAkAAAAABhwJAAAAAAZgCCAAAAAGZAgEAAAABmgIBAAAAAZwCAAAAnAICnQIBAAAAAQsNAACeBQAg_wEBAAAAAYYCQAAAAAGHAkAAAAABwQIBAAAAAcICAQAAAAHDAgEAAAABxAIBAAAAAcUCAQAAAAHGAgEAAAABxwIBAAAAAQIAAAABACAgAACPBQAgAwAAACIAICAAAI8FACAhAACTBQAgDQAAACIAIA0AAJQFACAZAACTBQAg_wEBAN4DACGGAkAA4gMAIYcCQADiAwAhwQIBAN4DACHCAgEA3gMAIcMCAQDeAwAhxAIBAN8DACHFAgEA3wMAIcYCAQDfAwAhxwIBAN8DACELDQAAlAUAIP8BAQDeAwAhhgJAAOIDACGHAkAA4gMAIcECAQDeAwAhwgIBAN4DACHDAgEA3gMAIcQCAQDfAwAhxQIBAN8DACHGAgEA3wMAIccCAQDfAwAhCyAAAJUFADAhAACZBQAwzAIAAJYFADDNAgAAlwUAMM4CAACwBAAwzwIAALAEADDQAgAAsAQAMNECAACYBQAg0gIAALAEADDTAgAAmgUAMNQCAACzBAAwCgkAAIYEACAMAACIBAAg_wEBAAAAAYYCQAAAAAGIAgEAAAABlAIBAAAAAZ4CAgAAAAGfAgIAAAABogIAAACiAgKjAgAAAJwCAgIAAAAWACAgAACdBQAgAwAAABYAICAAAJ0FACAhAACcBQAgARkAAO0FADACAAAAFgAgGQAAnAUAIAIAAAC0BAAgGQAAmwUAIAj_AQEA3gMAIYYCQADiAwAhiAIBAN4DACGUAgEA3gMAIZ4CAgD8AwAhnwICAPwDACGiAgAA_QOiAiKjAgAA8gOcAiIKCQAA_gMAIAwAAIAEACD_AQEA3gMAIYYCQADiAwAhiAIBAN4DACGUAgEA3gMAIZ4CAgD8AwAhnwICAPwDACGiAgAA_QOiAiKjAgAA8gOcAiIKCQAAhgQAIAwAAIgEACD_AQEAAAABhgJAAAAAAYgCAQAAAAGUAgEAAAABngICAAAAAZ8CAgAAAAGiAgAAAKICAqMCAAAAnAICBCAAAJUFADDMAgAAlgUAMNACAACwBAAw0QIAAJgFACAGCQAA2QQAIP8BAQAAAAGGAkAAAAABhwJAAAAAAZQCAQAAAAGfAgIAAAABAgAAAA0AICAAAKcFACADAAAADQAgIAAApwUAICEAAKYFACABGQAA7AUAMAIAAAANACAZAACmBQAgAgAAAJoEACAZAAClBQAgBf8BAQDeAwAhhgJAAOIDACGHAkAA4gMAIZQCAQDeAwAhnwICAPwDACEGCQAA2AQAIP8BAQDeAwAhhgJAAOIDACGHAkAA4gMAIZQCAQDeAwAhnwICAPwDACEGCQAA2QQAIP8BAQAAAAGGAkAAAAABhwJAAAAAAZQCAQAAAAGfAgIAAAABDP8BAQAAAAGGAkAAAAABhwJAAAAAAa4CAQAAAAGvAgEAAAABsAIBAAAAAbECAQAAAAGyAgEAAAABswJAAAAAAbQCQAAAAAG1AgEAAAABtgIBAAAAAQIAAAAJACAgAACzBQAgAwAAAAkAICAAALMFACAhAACyBQAgARkAAOsFADARAwAAjgMAIPwBAADXAwAw_QEAAAcAEP4BAADXAwAw_wEBAAAAAYYCQACNAwAhhwJAAI0DACGIAgEAiQMAIa4CAQCJAwAhrwIBAIkDACGwAgEAigMAIbECAQCKAwAhsgIBAIoDACGzAkAAjAMAIbQCQACMAwAhtQIBAIoDACG2AgEAigMAIQIAAAAJACAZAACyBQAgAgAAALAFACAZAACxBQAgEPwBAACvBQAw_QEAALAFABD-AQAArwUAMP8BAQCJAwAhhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhrgIBAIkDACGvAgEAiQMAIbACAQCKAwAhsQIBAIoDACGyAgEAigMAIbMCQACMAwAhtAJAAIwDACG1AgEAigMAIbYCAQCKAwAhEPwBAACvBQAw_QEAALAFABD-AQAArwUAMP8BAQCJAwAhhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhrgIBAIkDACGvAgEAiQMAIbACAQCKAwAhsQIBAIoDACGyAgEAigMAIbMCQACMAwAhtAJAAIwDACG1AgEAigMAIbYCAQCKAwAhDP8BAQDeAwAhhgJAAOIDACGHAkAA4gMAIa4CAQDeAwAhrwIBAN4DACGwAgEA3wMAIbECAQDfAwAhsgIBAN8DACGzAkAA4QMAIbQCQADhAwAhtQIBAN8DACG2AgEA3wMAIQz_AQEA3gMAIYYCQADiAwAhhwJAAOIDACGuAgEA3gMAIa8CAQDeAwAhsAIBAN8DACGxAgEA3wMAIbICAQDfAwAhswJAAOEDACG0AkAA4QMAIbUCAQDfAwAhtgIBAN8DACEM_wEBAAAAAYYCQAAAAAGHAkAAAAABrgIBAAAAAa8CAQAAAAGwAgEAAAABsQIBAAAAAbICAQAAAAGzAkAAAAABtAJAAAAAAbUCAQAAAAG2AgEAAAABB_8BAQAAAAGGAkAAAAABhwJAAAAAAa0CQAAAAAG3AgEAAAABuAIBAAAAAbkCAQAAAAECAAAABQAgIAAAvwUAIAMAAAAFACAgAAC_BQAgIQAAvgUAIAEZAADqBQAwDAMAAI4DACD8AQAA2AMAMP0BAAADABD-AQAA2AMAMP8BAQAAAAGGAkAAjQMAIYcCQACNAwAhiAIBAIkDACGtAkAAjQMAIbcCAQAAAAG4AgEAigMAIbkCAQCKAwAhAgAAAAUAIBkAAL4FACACAAAAvAUAIBkAAL0FACAL_AEAALsFADD9AQAAvAUAEP4BAAC7BQAw_wEBAIkDACGGAkAAjQMAIYcCQACNAwAhiAIBAIkDACGtAkAAjQMAIbcCAQCJAwAhuAIBAIoDACG5AgEAigMAIQv8AQAAuwUAMP0BAAC8BQAQ_gEAALsFADD_AQEAiQMAIYYCQACNAwAhhwJAAI0DACGIAgEAiQMAIa0CQACNAwAhtwIBAIkDACG4AgEAigMAIbkCAQCKAwAhB_8BAQDeAwAhhgJAAOIDACGHAkAA4gMAIa0CQADiAwAhtwIBAN4DACG4AgEA3wMAIbkCAQDfAwAhB_8BAQDeAwAhhgJAAOIDACGHAkAA4gMAIa0CQADiAwAhtwIBAN4DACG4AgEA3wMAIbkCAQDfAwAhB_8BAQAAAAGGAkAAAAABhwJAAAAAAa0CQAAAAAG3AgEAAAABuAIBAAAAAbkCAQAAAAEEIAAAtAUAMMwCAAC1BQAw0AIAALgFADDRAgAAtwUAIAQgAACoBQAwzAIAAKkFADDQAgAArAUAMNECAACrBQAgBCAAAJ8FADDMAgAAoAUAMNACAACWBAAw0QIAAKIFACADIAAAjwUAIMwCAACQBQAg0AIAAAEAIAQgAACDBQAwzAIAAIQFADDQAgAAhwUAMNECAACGBQAgAyAAAP4EACDMAgAA_wQAINACAADuAQAgAyAAAPkEACDMAgAA-gQAINACAADeAgAgAyAAAPQEACDMAgAA9QQAINACAABJACAAAAAGAwAA5QMAIA0AANoFACDEAgAA2gMAIMUCAADaAwAgxgIAANoDACDHAgAA2gMAIAAFAwAA5QMAIAoAANoDACCCAgAA2gMAIIMCAADaAwAghQIAANoDACAFAwAA5QMAIAoAANoDACCCAgAA2gMAIIMCAADaAwAghQIAANoDACAEAwAA5QMAIIICAADaAwAggwIAANoDACCFAgAA2gMAIAAAAAUgAADlBQAgIQAA6AUAIMwCAADmBQAgzQIAAOcFACDQAgAAYQAgAyAAAOUFACDMAgAA5gUAINACAABhACAAAAAFIAAA4AUAICEAAOMFACDMAgAA4QUAIM0CAADiBQAg0AIAAGEAIAMgAADgBQAgzAIAAOEFACDQAgAAYQAgAAMJAADcBQAgCgAAywUAIAwAAN0FACAECAAA3gUAIA0AANoFACAOAADfBQAgDwAAygUAIAMDAADlAwAgCwAA2wUAIJoCAADaAwAgAgYAANIEACCXAgAA2gMAIAATBAAAwAUAIAUAAMEFACAPAADCBQAgEAAAxAUAIBEAAMUFACASAADGBQAgEwAAxwUAIP8BAQAAAAGAAgEAAAABgQIBAAAAAYQCIAAAAAGFAkAAAAABhgJAAAAAAYcCQAAAAAG6AiAAAAABuwIgAAAAAbwCAQAAAAG-AgAAAL4CA8ACAAAAwAIDAgAAAGEAICAAAOAFACADAAAAZAAgIAAA4AUAICEAAOQFACAVAAAAZAAgBAAA7AQAIAUAAO0EACAPAADuBAAgEAAA8AQAIBEAAPEEACASAADyBAAgEwAA8wQAIBkAAOQFACD_AQEA3gMAIYACAQDeAwAhgQIBAN4DACGEAiAA4AMAIYUCQADhAwAhhgJAAOIDACGHAkAA4gMAIboCIADgAwAhuwIgAOADACG8AgEA3wMAIb4CAADqBL4CI8ACAADrBMACIxMEAADsBAAgBQAA7QQAIA8AAO4EACAQAADwBAAgEQAA8QQAIBIAAPIEACATAADzBAAg_wEBAN4DACGAAgEA3gMAIYECAQDeAwAhhAIgAOADACGFAkAA4QMAIYYCQADiAwAhhwJAAOIDACG6AiAA4AMAIbsCIADgAwAhvAIBAN8DACG-AgAA6gS-AiPAAgAA6wTAAiMTBAAAwAUAIAUAAMEFACAKAADDBQAgDwAAwgUAIBAAAMQFACARAADFBQAgEgAAxgUAIP8BAQAAAAGAAgEAAAABgQIBAAAAAYQCIAAAAAGFAkAAAAABhgJAAAAAAYcCQAAAAAG6AiAAAAABuwIgAAAAAbwCAQAAAAG-AgAAAL4CA8ACAAAAwAIDAgAAAGEAICAAAOUFACADAAAAZAAgIAAA5QUAICEAAOkFACAVAAAAZAAgBAAA7AQAIAUAAO0EACAKAADvBAAgDwAA7gQAIBAAAPAEACARAADxBAAgEgAA8gQAIBkAAOkFACD_AQEA3gMAIYACAQDeAwAhgQIBAN4DACGEAiAA4AMAIYUCQADhAwAhhgJAAOIDACGHAkAA4gMAIboCIADgAwAhuwIgAOADACG8AgEA3wMAIb4CAADqBL4CI8ACAADrBMACIxMEAADsBAAgBQAA7QQAIAoAAO8EACAPAADuBAAgEAAA8AQAIBEAAPEEACASAADyBAAg_wEBAN4DACGAAgEA3gMAIYECAQDeAwAhhAIgAOADACGFAkAA4QMAIYYCQADiAwAhhwJAAOIDACG6AiAA4AMAIbsCIADgAwAhvAIBAN8DACG-AgAA6gS-AiPAAgAA6wTAAiMH_wEBAAAAAYYCQAAAAAGHAkAAAAABrQJAAAAAAbcCAQAAAAG4AgEAAAABuQIBAAAAAQz_AQEAAAABhgJAAAAAAYcCQAAAAAGuAgEAAAABrwIBAAAAAbACAQAAAAGxAgEAAAABsgIBAAAAAbMCQAAAAAG0AkAAAAABtQIBAAAAAbYCAQAAAAEF_wEBAAAAAYYCQAAAAAGHAkAAAAABlAIBAAAAAZ8CAgAAAAEI_wEBAAAAAYYCQAAAAAGIAgEAAAABlAIBAAAAAZ4CAgAAAAGfAgIAAAABogIAAACiAgKjAgAAAJwCAgj_AQEAAAABhgJAAAAAAYcCQAAAAAGYAggAAAABmQIBAAAAAZoCAQAAAAGcAgAAAJwCAp0CAQAAAAETBQAAwQUAIAoAAMMFACAPAADCBQAgEAAAxAUAIBEAAMUFACASAADGBQAgEwAAxwUAIP8BAQAAAAGAAgEAAAABgQIBAAAAAYQCIAAAAAGFAkAAAAABhgJAAAAAAYcCQAAAAAG6AiAAAAABuwIgAAAAAbwCAQAAAAG-AgAAAL4CA8ACAAAAwAIDAgAAAGEAICAAAO8FACADAAAAZAAgIAAA7wUAICEAAPMFACAVAAAAZAAgBQAA7QQAIAoAAO8EACAPAADuBAAgEAAA8AQAIBEAAPEEACASAADyBAAgEwAA8wQAIBkAAPMFACD_AQEA3gMAIYACAQDeAwAhgQIBAN4DACGEAiAA4AMAIYUCQADhAwAhhgJAAOIDACGHAkAA4gMAIboCIADgAwAhuwIgAOADACG8AgEA3wMAIb4CAADqBL4CI8ACAADrBMACIxMFAADtBAAgCgAA7wQAIA8AAO4EACAQAADwBAAgEQAA8QQAIBIAAPIEACATAADzBAAg_wEBAN4DACGAAgEA3gMAIYECAQDeAwAhhAIgAOADACGFAkAA4QMAIYYCQADiAwAhhwJAAOIDACG6AiAA4AMAIbsCIADgAwAhvAIBAN8DACG-AgAA6gS-AiPAAgAA6wTAAiMTBAAAwAUAIAoAAMMFACAPAADCBQAgEAAAxAUAIBEAAMUFACASAADGBQAgEwAAxwUAIP8BAQAAAAGAAgEAAAABgQIBAAAAAYQCIAAAAAGFAkAAAAABhgJAAAAAAYcCQAAAAAG6AiAAAAABuwIgAAAAAbwCAQAAAAG-AgAAAL4CA8ACAAAAwAIDAgAAAGEAICAAAPQFACADAAAAZAAgIAAA9AUAICEAAPgFACAVAAAAZAAgBAAA7AQAIAoAAO8EACAPAADuBAAgEAAA8AQAIBEAAPEEACASAADyBAAgEwAA8wQAIBkAAPgFACD_AQEA3gMAIYACAQDeAwAhgQIBAN4DACGEAiAA4AMAIYUCQADhAwAhhgJAAOIDACGHAkAA4gMAIboCIADgAwAhuwIgAOADACG8AgEA3wMAIb4CAADqBL4CI8ACAADrBMACIxMEAADsBAAgCgAA7wQAIA8AAO4EACAQAADwBAAgEQAA8QQAIBIAAPIEACATAADzBAAg_wEBAN4DACGAAgEA3gMAIYECAQDeAwAhhAIgAOADACGFAkAA4QMAIYYCQADiAwAhhwJAAOIDACG6AiAA4AMAIbsCIADgAwAhvAIBAN8DACG-AgAA6gS-AiPAAgAA6wTAAiMLCAAAuAQAIA0AALkEACAOAAC6BAAg_wEBAAAAAYACAQAAAAGGAkAAAAABhwJAAAAAAaQCAgAAAAGlAgIAAAABpgIBAAAAAacCAQAAAAECAAAAEQAgIAAA-QUAIAMAAAAPACAgAAD5BQAgIQAA_QUAIA0AAAAPACAIAACOBAAgDQAAjwQAIA4AAJAEACAZAAD9BQAg_wEBAN4DACGAAgEA3gMAIYYCQADiAwAhhwJAAOIDACGkAgIA_AMAIaUCAgD8AwAhpgIBAN4DACGnAgEA3gMAIQsIAACOBAAgDQAAjwQAIA4AAJAEACD_AQEA3gMAIYACAQDeAwAhhgJAAOIDACGHAkAA4gMAIaQCAgD8AwAhpQICAPwDACGmAgEA3gMAIacCAQDeAwAhB_8BAQAAAAGAAgEAAAABhgJAAAAAAYcCQAAAAAGkAgIAAAABpQICAAAAAacCAQAAAAETBAAAwAUAIAUAAMEFACAKAADDBQAgDwAAwgUAIBAAAMQFACASAADGBQAgEwAAxwUAIP8BAQAAAAGAAgEAAAABgQIBAAAAAYQCIAAAAAGFAkAAAAABhgJAAAAAAYcCQAAAAAG6AiAAAAABuwIgAAAAAbwCAQAAAAG-AgAAAL4CA8ACAAAAwAIDAgAAAGEAICAAAP8FACADAAAAZAAgIAAA_wUAICEAAIMGACAVAAAAZAAgBAAA7AQAIAUAAO0EACAKAADvBAAgDwAA7gQAIBAAAPAEACASAADyBAAgEwAA8wQAIBkAAIMGACD_AQEA3gMAIYACAQDeAwAhgQIBAN4DACGEAiAA4AMAIYUCQADhAwAhhgJAAOIDACGHAkAA4gMAIboCIADgAwAhuwIgAOADACG8AgEA3wMAIb4CAADqBL4CI8ACAADrBMACIxMEAADsBAAgBQAA7QQAIAoAAO8EACAPAADuBAAgEAAA8AQAIBIAAPIEACATAADzBAAg_wEBAN4DACGAAgEA3gMAIYECAQDeAwAhhAIgAOADACGFAkAA4QMAIYYCQADiAwAhhwJAAOIDACG6AiAA4AMAIbsCIADgAwAhvAIBAN8DACG-AgAA6gS-AiPAAgAA6wTAAiMD_wEBAAAAAZcCAQAAAAGnAgEAAAABAgAAANUBACAgAACEBgAgCP8BAQAAAAGGAkAAAAABiAIBAAAAAZ4CAgAAAAGfAgIAAAABoAIBAAAAAaICAAAAogICowIAAACcAgIG_wEBAAAAAYYCQAAAAAGHAkAAAAABiAIBAAAAAZYCAAAAlgIDlwIBAAAAARMEAADABQAgBQAAwQUAIAoAAMMFACAQAADEBQAgEQAAxQUAIBIAAMYFACATAADHBQAg_wEBAAAAAYACAQAAAAGBAgEAAAABhAIgAAAAAYUCQAAAAAGGAkAAAAABhwJAAAAAAboCIAAAAAG7AiAAAAABvAIBAAAAAb4CAAAAvgIDwAIAAADAAgMCAAAAYQAgIAAAiAYAIAMAAABkACAgAACIBgAgIQAAjAYAIBUAAABkACAEAADsBAAgBQAA7QQAIAoAAO8EACAQAADwBAAgEQAA8QQAIBIAAPIEACATAADzBAAgGQAAjAYAIP8BAQDeAwAhgAIBAN4DACGBAgEA3gMAIYQCIADgAwAhhQJAAOEDACGGAkAA4gMAIYcCQADiAwAhugIgAOADACG7AiAA4AMAIbwCAQDfAwAhvgIAAOoEvgIjwAIAAOsEwAIjEwQAAOwEACAFAADtBAAgCgAA7wQAIBAAAPAEACARAADxBAAgEgAA8gQAIBMAAPMEACD_AQEA3gMAIYACAQDeAwAhgQIBAN4DACGEAiAA4AMAIYUCQADhAwAhhgJAAOIDACGHAkAA4gMAIboCIADgAwAhuwIgAOADACG8AgEA3wMAIb4CAADqBL4CI8ACAADrBMACIwX_AQEAAAABhgJAAAAAAYcCQAAAAAGIAgEAAAABnwICAAAAAQMAAADYAQAgIAAAhAYAICEAAJAGACAFAAAA2AEAIBkAAJAGACD_AQEA3gMAIZcCAQDfAwAhpwIBAN4DACED_wEBAN4DACGXAgEA3wMAIacCAQDeAwAhDAMAANkFACD_AQEAAAABhgJAAAAAAYcCQAAAAAGIAgEAAAABwQIBAAAAAcICAQAAAAHDAgEAAAABxAIBAAAAAcUCAQAAAAHGAgEAAAABxwIBAAAAAQIAAAABACAgAACRBgAgCwgAALgEACAOAAC6BAAgDwAAuwQAIP8BAQAAAAGAAgEAAAABhgJAAAAAAYcCQAAAAAGkAgIAAAABpQICAAAAAaYCAQAAAAGnAgEAAAABAgAAABEAICAAAJMGACADAAAAIgAgIAAAkQYAICEAAJcGACAOAAAAIgAgAwAA2AUAIBkAAJcGACD_AQEA3gMAIYYCQADiAwAhhwJAAOIDACGIAgEA3gMAIcECAQDeAwAhwgIBAN4DACHDAgEA3gMAIcQCAQDfAwAhxQIBAN8DACHGAgEA3wMAIccCAQDfAwAhDAMAANgFACD_AQEA3gMAIYYCQADiAwAhhwJAAOIDACGIAgEA3gMAIcECAQDeAwAhwgIBAN4DACHDAgEA3gMAIcQCAQDfAwAhxQIBAN8DACHGAgEA3wMAIccCAQDfAwAhAwAAAA8AICAAAJMGACAhAACaBgAgDQAAAA8AIAgAAI4EACAOAACQBAAgDwAAkQQAIBkAAJoGACD_AQEA3gMAIYACAQDeAwAhhgJAAOIDACGHAkAA4gMAIaQCAgD8AwAhpQICAPwDACGmAgEA3gMAIacCAQDeAwAhCwgAAI4EACAOAACQBAAgDwAAkQQAIP8BAQDeAwAhgAIBAN4DACGGAkAA4gMAIYcCQADiAwAhpAICAPwDACGlAgIA_AMAIaYCAQDeAwAhpwIBAN4DACETBAAAwAUAIAUAAMEFACAKAADDBQAgDwAAwgUAIBEAAMUFACASAADGBQAgEwAAxwUAIP8BAQAAAAGAAgEAAAABgQIBAAAAAYQCIAAAAAGFAkAAAAABhgJAAAAAAYcCQAAAAAG6AiAAAAABuwIgAAAAAbwCAQAAAAG-AgAAAL4CA8ACAAAAwAIDAgAAAGEAICAAAJsGACALCQAAhgQAIAoAAIcEACD_AQEAAAABhgJAAAAAAYgCAQAAAAGUAgEAAAABngICAAAAAZ8CAgAAAAGgAgEAAAABogIAAACiAgKjAgAAAJwCAgIAAAAWACAgAACdBgAgAwAAAGQAICAAAJsGACAhAAChBgAgFQAAAGQAIAQAAOwEACAFAADtBAAgCgAA7wQAIA8AAO4EACARAADxBAAgEgAA8gQAIBMAAPMEACAZAAChBgAg_wEBAN4DACGAAgEA3gMAIYECAQDeAwAhhAIgAOADACGFAkAA4QMAIYYCQADiAwAhhwJAAOIDACG6AiAA4AMAIbsCIADgAwAhvAIBAN8DACG-AgAA6gS-AiPAAgAA6wTAAiMTBAAA7AQAIAUAAO0EACAKAADvBAAgDwAA7gQAIBEAAPEEACASAADyBAAgEwAA8wQAIP8BAQDeAwAhgAIBAN4DACGBAgEA3gMAIYQCIADgAwAhhQJAAOEDACGGAkAA4gMAIYcCQADiAwAhugIgAOADACG7AiAA4AMAIbwCAQDfAwAhvgIAAOoEvgIjwAIAAOsEwAIjAwAAABQAICAAAJ0GACAhAACkBgAgDQAAABQAIAkAAP4DACAKAAD_AwAgGQAApAYAIP8BAQDeAwAhhgJAAOIDACGIAgEA3gMAIZQCAQDeAwAhngICAPwDACGfAgIA_AMAIaACAQDeAwAhogIAAP0DogIiowIAAPIDnAIiCwkAAP4DACAKAAD_AwAg_wEBAN4DACGGAkAA4gMAIYgCAQDeAwAhlAIBAN4DACGeAgIA_AMAIZ8CAgD8AwAhoAIBAN4DACGiAgAA_QOiAiKjAgAA8gOcAiILCAAAuAQAIA0AALkEACAPAAC7BAAg_wEBAAAAAYACAQAAAAGGAkAAAAABhwJAAAAAAaQCAgAAAAGlAgIAAAABpgIBAAAAAacCAQAAAAECAAAAEQAgIAAApQYAIAMAAAAPACAgAAClBgAgIQAAqQYAIA0AAAAPACAIAACOBAAgDQAAjwQAIA8AAJEEACAZAACpBgAg_wEBAN4DACGAAgEA3gMAIYYCQADiAwAhhwJAAOIDACGkAgIA_AMAIaUCAgD8AwAhpgIBAN4DACGnAgEA3gMAIQsIAACOBAAgDQAAjwQAIA8AAJEEACD_AQEA3gMAIYACAQDeAwAhhgJAAOIDACGHAkAA4gMAIaQCAgD8AwAhpQICAPwDACGmAgEA3gMAIacCAQDeAwAhEwQAAMAFACAFAADBBQAgCgAAwwUAIA8AAMIFACAQAADEBQAgEQAAxQUAIBMAAMcFACD_AQEAAAABgAIBAAAAAYECAQAAAAGEAiAAAAABhQJAAAAAAYYCQAAAAAGHAkAAAAABugIgAAAAAbsCIAAAAAG8AgEAAAABvgIAAAC-AgPAAgAAAMACAwIAAABhACAgAACqBgAgAwAAAGQAICAAAKoGACAhAACuBgAgFQAAAGQAIAQAAOwEACAFAADtBAAgCgAA7wQAIA8AAO4EACAQAADwBAAgEQAA8QQAIBMAAPMEACAZAACuBgAg_wEBAN4DACGAAgEA3gMAIYECAQDeAwAhhAIgAOADACGFAkAA4QMAIYYCQADiAwAhhwJAAOIDACG6AiAA4AMAIbsCIADgAwAhvAIBAN8DACG-AgAA6gS-AiPAAgAA6wTAAiMTBAAA7AQAIAUAAO0EACAKAADvBAAgDwAA7gQAIBAAAPAEACARAADxBAAgEwAA8wQAIP8BAQDeAwAhgAIBAN4DACGBAgEA3gMAIYQCIADgAwAhhQJAAOEDACGGAkAA4gMAIYcCQADiAwAhugIgAOADACG7AiAA4AMAIbwCAQDfAwAhvgIAAOoEvgIjwAIAAOsEwAIjAwMAAgcAEQ0xCQkEBgMFCgQHABAKIwEPDgUQJgoRKA0SKg4TLA8BAwACAQMAAgIDAAIJAAYFBwAMCAAHDRcJDh0LDx4FAgYSBgcACAEGEwADCQAGCgABDBkKAgMAAgsACQEJAAYDDR8ADiAADyEAAQMAAgEDAAIBAwACBAQtAAUuAA8vABAwAAENMgAAAQMAAgEDAAIDBwAWJgAXJwAYAAAAAwcAFiYAFycAGAEDAAIBAwACAwcAHSYAHicAHwAAAAMHAB0mAB4nAB8AAAMHACQmACUnACYAAAADBwAkJgAlJwAmAQMAAgEDAAIDBwArJgAsJwAtAAAAAwcAKyYALCcALQEDAAIBAwACAwcAMiYAMycANAAAAAMHADImADMnADQAAAADBwA6JgA7JwA8AAAAAwcAOiYAOycAPAIDAAIJAAYCAwACCQAGBQcAQSYARCcARYgBAEKJAQBDAAAAAAAFBwBBJgBEJwBFiAEAQokBAEMAAAMHAEomAEsnAEwAAAADBwBKJgBLJwBMAQMAAgEDAAIDBwBRJgBSJwBTAAAAAwcAUSYAUicAUwEIAAcBCAAHBQcAWCYAWycAXIgBAFmJAQBaAAAAAAAFBwBYJgBbJwBciAEAWYkBAFoCCQAGCgABAgkABgoAAQUHAGEmAGQnAGWIAQBiiQEAYwAAAAAABQcAYSYAZCcAZYgBAGKJAQBjAgMAAgsACQIDAAILAAkFBwBqJgBtJwBuiAEAa4kBAGwAAAAAAAUHAGomAG0nAG6IAQBriQEAbAEJAAYBCQAGAwcAcyYAdCcAdQAAAAMHAHMmAHQnAHUBAwACAQMAAgMHAHomAHsnAHwAAAADBwB6JgB7JwB8FAIBFTMBFjUBFzYBGDcBGjkBGzsSHDwTHT4BHkASH0EUIkIBI0MBJEQSKEcVKUgZKkoPK0sPLE0PLU4PLk8PL1EPMFMSMVQaMlYPM1gSNFkbNVoPNlsPN1wSOF8cOWAgOmICO2MCPGYCPWcCPmgCP2oCQGwSQW0hQm8CQ3ESRHIiRXMCRnQCR3USSHgjSXknSnoDS3sDTHwDTX0DTn4DT4ABA1CCARJRgwEoUoUBA1OHARJUiAEpVYkBA1aKAQNXiwESWI4BKlmPAS5akAEEW5EBBFySAQRdkwEEXpQBBF-WAQRgmAESYZkBL2KbAQRjnQESZJ4BMGWfAQRmoAEEZ6EBEmikATFppQE1aqcBNmuoATZsqwE2bawBNm6tATZvrwE2cLEBEnGyATdytAE2c7YBEnS3ATh1uAE2drkBNne6ARJ4vQE5eb4BPXq_AQV7wAEFfMEBBX3CAQV-wwEFf8UBBYABxwESgQHIAT6CAcoBBYMBzAEShAHNAT-FAc4BBYYBzwEFhwHQARKKAdMBQIsB1AFGjAHWAQeNAdcBB44B2gEHjwHbAQeQAdwBB5EB3gEHkgHgARKTAeEBR5QB4wEHlQHlARKWAeYBSJcB5wEHmAHoAQeZAekBEpoB7AFJmwHtAU2cAe8BDZ0B8AENngHyAQ2fAfMBDaAB9AENoQH2AQ2iAfgBEqMB-QFOpAH7AQ2lAf0BEqYB_gFPpwH_AQ2oAYACDakBgQISqgGEAlCrAYUCVKwBhgIGrQGHAgauAYgCBq8BiQIGsAGKAgaxAYwCBrIBjgISswGPAlW0AZECBrUBkwIStgGUAla3AZUCBrgBlgIGuQGXAhK6AZoCV7sBmwJdvAGcAgm9AZ0CCb4BngIJvwGfAgnAAaACCcEBogIJwgGkAhLDAaUCXsQBpwIJxQGpAhLGAaoCX8cBqwIJyAGsAgnJAa0CEsoBsAJgywGxAmbMAbICCs0BswIKzgG0AgrPAbUCCtABtgIK0QG4AgrSAboCEtMBuwJn1AG9AgrVAb8CEtYBwAJo1wHBAgrYAcICCtkBwwIS2gHGAmnbAccCb9wByAIL3QHJAgveAcoCC98BywIL4AHMAgvhAc4CC-IB0AIS4wHRAnDkAdMCC-UB1QIS5gHWAnHnAdcCC-gB2AIL6QHZAhLqAdwCcusB3QJ27AHfAg7tAeACDu4B4gIO7wHjAg7wAeQCDvEB5gIO8gHoAhLzAekCd_QB6wIO9QHtAhL2Ae4CePcB7wIO-AHwAg75AfECEvoB9AJ5-wH1An0"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/enums.ts
var UserStatus = {
  ACTIVE: "ACTIVE",
  DELETED: "DELETED",
  BLOCKED: "BLOCKED"
};
var OrderStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED"
};
var Role = {
  CUSTOMER: "CUSTOMER",
  SELLER: "SELLER",
  ADMIN: "ADMIN"
};
var PaymentStatus = {
  PAID: "PAID",
  UNPAID: "UNPAID",
  CANCELLED: "CANCELLED"
};

// src/generated/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/config/env.ts
import dotenv from "dotenv";
dotenv.config();
var loadEnvVariables = () => {
  const requiredEnvVariable = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "APP_URL",
    "APP_USER",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN",
    "EMAIL_SENDER_SMTP_USER",
    "EMAIL_SENDER_SMTP_PASS",
    "EMAIL_SENDER_SMTP_HOST",
    "EMAIL_SENDER_SMTP_PORT",
    "EMAIL_SENDER_SMTP_FROM",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET"
  ];
  requiredEnvVariable.forEach((variable) => {
    if (!process.env[variable]) {
      throw new Error(`Environment variable ${variable} is required but not set in .env file.`);
    }
  });
  return {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    APP_URL: process.env.APP_URL,
    APP_USER: process.env.APP_USER,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
    BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: process.env.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN,
    EMAIL_SENDER: {
      SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER,
      SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS,
      SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST,
      SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT,
      SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM
    },
    CLOUDINARY: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
    }
  };
};
var envVars = loadEnvVariables();

// src/lib/prisma.ts
var connectionString = envVars.DATABASE_URL;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/module/medicine/medicine.service.ts
var getMedicineById = async (id) => {
  const result = await prisma.medicine.findUniqueOrThrow({
    where: {
      id
    },
    include: {
      reviews: true
    }
  });
  return result;
};
var getAllMedicine = async ({ search, price, category, page, limit, sortBy, sortOrder }) => {
  const skip = (page - 1) * limit;
  const priceNum = Number(price);
  const andConditions = [];
  if (search) {
    andConditions.push({
      name: {
        contains: search,
        mode: "insensitive"
      }
    });
  }
  if (priceNum) {
    andConditions.push({
      price: priceNum
    });
  }
  if (category) {
    andConditions.push({
      categoryName: category
    });
  }
  const result = await prisma.medicine.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions
    },
    orderBy: sortBy && sortOrder ? {
      [sortBy]: sortOrder
    } : { price: "asc" },
    include: {
      orders: true,
      reviews: true
    }
  });
  const total = await prisma.medicine.count({
    // take : limit,
    // skip,
    where: {
      AND: andConditions
    }
  });
  return {
    data: result,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var medicineService = {
  getMedicineById,
  getAllMedicine
};

// src/module/medicine/medicine.controller.ts
var getMedicineById2 = async (req, res) => {
  try {
    const result = await medicineService.getMedicineById(req.params.id);
    res.status(400).json(result);
  } catch (error) {
    res.status(404).json(error);
  }
};
var getAllMedicine2 = async (req, res) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : void 0;
    const { price } = req.query;
    const priceString = typeof price === "string" ? price : void 0;
    const { category } = req.query;
    const categoryString = typeof category === "string" ? category : void 0;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const sortBy = req.query.sortBy ?? "price";
    const sortOrder = req.query.sortOrder ?? "asc";
    const result = await medicineService.getAllMedicine({ search: searchString, price: priceString, category: categoryString, page, limit, sortBy, sortOrder });
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json(error);
  }
};
var medicineController = {
  getMedicineById: getMedicineById2,
  getAllMedicine: getAllMedicine2
};

// src/module/medicine/medicine.route.ts
var router = express.Router();
router.get("/", medicineController.getAllMedicine);
router.get("/:id", medicineController.getMedicineById);
var medicineRouter = router;

// src/module/category/category.route.ts
import express2 from "express";

// src/module/category/category.service.ts
var createCategory = async (data) => {
  const result = await prisma.category.create({
    data
  });
  return result;
};
var getSingleCategory = async (categoryName) => {
  const result = await prisma.category.findUnique({
    where: {
      categoryName
    },
    include: {
      medicines: {
        select: {
          name: true,
          price: true
        }
      }
    }
  });
  return result;
};
var getAllCategory = async () => {
  const result = await prisma.category.findMany();
  return result;
};
var categoryService = {
  createCategory,
  getSingleCategory,
  getAllCategory
};

// src/module/category/category.controller.ts
var createCategory2 = async (req, res) => {
  try {
    const result = await categoryService.createCategory(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.send(error);
  }
};
var getCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const result = await categoryService.getSingleCategory(categoryName);
    res.status(500).json(result);
  } catch (error) {
    console.log("Category is not found");
    res.status(404).json(error);
  }
};
var getAllCategory2 = async (req, res) => {
  try {
    const result = await categoryService.getAllCategory();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};
var categoryController = {
  createCategory: createCategory2,
  getCategory,
  getAllCategory: getAllCategory2
};

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer2 from "nodemailer";
import { bearer, emailOTP } from "better-auth/plugins";

// src/utils/email.ts
import nodemailer from "nodemailer";

// src/errorHelper/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var AppError_default = AppError;

// src/utils/email.ts
import status from "http-status";
import path2 from "path";
import ejs from "ejs";
var transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  secure: true,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS
  },
  port: Number(envVars.EMAIL_SENDER.SMTP_PASS)
});
var sendEmail = async ({ subject, templateData, templateName, to, attachments }) => {
  try {
    const templatePath = path2.resolve(process.cwd(), `src/templates/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType
      }))
    });
  } catch (error) {
    console.log("Email Sending Error", error.message);
    throw new AppError_default(status.INTERNAL_SERVER_ERROR, "Failed to send Email");
  }
};

// src/lib/auth.ts
var transporter2 = nodemailer2.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: envVars.APP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS
  }
});
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  trustedOrigins: [
    "http://localhost:3000",
    envVars.APP_URL
  ],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: Role.CUSTOMER,
        required: false
      },
      userStatus: {
        type: "string",
        defaultValue: UserStatus.ACTIVE,
        required: false
      },
      needPasswordChange: {
        type: "boolean",
        defaultValue: false,
        required: false
      },
      isDeleted: {
        type: "boolean",
        defaultValue: false,
        required: false
      },
      deletedAt: {
        type: "date",
        defaultValue: null,
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true
  },
  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          const user = await prisma.user.findUnique({
            where: {
              email
            }
          });
          if (user && !user.emailVerified) {
            sendEmail({
              to: email,
              subject: "Verify your Email",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp
              }
            });
          }
        }
      },
      expiresIn: 2 * 60,
      // 2 min in seconds
      otpLength: 6
    })
  ],
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${envVars.APP_URL}/verify-email?token=${token}`;
        const info = await transporter2.sendMail({
          from: '"fgg" <u1904067@student.cuet.ac.bd>',
          to: user.email,
          subject: "Email verification for Medi Store",
          text: "Hello world?",
          html: `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Email Verification</title>
      </head>
      <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden;">
                
                <!-- Header -->
                <tr>
                  <td style="background-color:#2f80ed; padding:20px; text-align:center;">
                    <h1 style="margin:0; color:#ffffff; font-size:24px;">Medi Store</h1>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:30px; color:#333333;">
                    <h2 style="margin-top:0;">Verify your email address</h2>
                    <p style="font-size:15px; line-height:1.6;">
                      Thanks for signing up with <strong>Medi Store</strong>.
                      Please confirm your email address by clicking the button below.
                    </p>

                    <div style="text-align:center; margin:30px 0;">
                      <a href="${verificationUrl}"
                        style="background-color:#2f80ed; color:#ffffff; text-decoration:none;
                                padding:12px 24px; border-radius:5px; font-size:16px; display:inline-block;">
                        Verify Email
                      </a>
                    </div>

                    <p style="font-size:14px; line-height:1.6; color:#555555;">
                      If the button doesn\u2019t work, copy and paste this link into your browser:
                    </p>
                    <p style="word-break:break-all; font-size:13px; color:#2f80ed;">
                      ${verificationUrl}
                    </p>

                    <p style="font-size:14px; color:#777777;">
                      If you didn\u2019t create an account, you can safely ignore this email.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color:#f0f0f0; padding:15px; text-align:center; font-size:12px; color:#888888;">
                    \xA9 2026 Medi Store. All rights reserved.
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
                        `
        });
        console.log("Message sent:", info.messageId);
      } catch (error) {
        console.log("An Error Occur to send Email", error);
        throw error;
      }
    }
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET
    }
  }
});

// src/middlewares/auth.ts
var auth2 = (...roles) => {
  return async (req, res, next) => {
    const session = await auth.api.getSession({
      headers: {
        cookie: req.headers.cookie || ""
      }
    });
    if (!session) {
      return res.status(401).json({
        success: false,
        message: `You are not Authorized!!`
      });
    }
    if (!session.user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Your Email is not Verified. Please Verify your email."
      });
    }
    req.user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
      emailVerified: session.user.emailVerified
    };
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden. You don't have permission to this resources."
      });
    }
    next();
  };
};

// src/middlewares/validateRequest.ts
var validateRequest = (zodSchema) => {
  return (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    const parseResult = zodSchema.safeParse(req.body);
    if (!parseResult.success) {
      next(parseResult.error);
    }
    req.body = parseResult.data;
    next();
  };
};

// src/module/category/category.validation.ts
import z from "zod";
var createCategoryZodSchema = z.object({
  categoryName: z.string().min(1, "Category name is required").max(30, "Category name must be less than 30 characters"),
  description: z.string().optional()
});

// src/module/category/category.route.ts
var router2 = express2.Router();
router2.get("/", categoryController.getAllCategory);
router2.get("/:categoryName", categoryController.getCategory);
router2.post("/", auth2(Role.SELLER, Role.ADMIN), validateRequest(createCategoryZodSchema), categoryController.createCategory);
var categoryRoute = router2;

// src/app.ts
import cors from "cors";

// src/module/seller/seller.route.ts
import express3 from "express";

// src/module/seller/seller.service.ts
var createMedicine = async (payload) => {
  const category = await prisma.category.findUniqueOrThrow({
    where: {
      categoryName: payload.categoryName
    }
  });
  const result = await prisma.medicine.create({
    data: {
      ...payload,
      categoryId: category.id
    }
  });
  return result;
};
var updateMedicine = async (payload, id) => {
  await prisma.medicine.findUniqueOrThrow({
    where: {
      id
    }
  });
  const result = await prisma.medicine.update({
    where: {
      id
    },
    data: {
      name: payload.name,
      price: payload.price,
      stock: payload.stock
    }
  });
  return result;
};
var deleteMedicine = async (id) => {
  await prisma.medicine.findUniqueOrThrow({
    where: {
      id
    }
  });
  try {
    const result = await prisma.medicine.delete({
      where: {
        id
      }
    });
    return result;
  } catch (error) {
    throw new Error("Medicine is not Exists!");
  }
};
var getAllOrder = async () => {
  const result = await prisma.order.findMany();
  return result;
};
var updateStatus = async (payload, id) => {
  console.log(id);
  console.log(payload);
  await prisma.order.findUniqueOrThrow({
    where: {
      id
    }
  });
  const result = await prisma.order.update({
    where: {
      id
    },
    data: payload
  });
  console.log(result);
  return result;
};
var sellerServices = {
  createMedicine,
  updateMedicine,
  deleteMedicine,
  getAllOrder,
  updateStatus
};

// src/shared/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// src/shared/sendResponse.ts
var sendResponse = (res, responseData) => {
  const { httpStatusCode, success, message, data, meta } = responseData;
  res.status(httpStatusCode).json({
    success,
    message,
    data,
    meta
  });
};

// src/module/seller/seller.controller.ts
import status2 from "http-status";
var createMedicine2 = catchAsync(async (req, res) => {
  try {
    const result = await sellerServices.createMedicine(req.body);
    sendResponse(res, {
      httpStatusCode: status2.OK,
      success: true,
      message: "Medicine created successfully",
      data: result
    });
  } catch (error) {
    sendResponse(res, {
      httpStatusCode: status2.BAD_REQUEST,
      success: false,
      message: "Error creating medicine"
    });
  }
});
var updateMedicine2 = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sellerServices.updateMedicine(req.body, id);
    sendResponse(res, {
      httpStatusCode: status2.OK,
      success: true,
      message: "Medicine updated successfully",
      data: result
    });
  } catch (error) {
    sendResponse(res, {
      httpStatusCode: status2.BAD_REQUEST,
      success: false,
      message: "Error updating medicine"
    });
  }
});
var deleteMedicine2 = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sellerServices.deleteMedicine(id);
    sendResponse(res, {
      httpStatusCode: status2.OK,
      success: true,
      message: "Medicine deleted successfully",
      data: result
    });
  } catch (error) {
    sendResponse(res, {
      httpStatusCode: status2.BAD_REQUEST,
      success: false,
      message: "Error deleting medicine"
    });
  }
});
var getAllOrder2 = catchAsync(async (req, res) => {
  try {
    const result = await sellerServices.getAllOrder();
    sendResponse(res, {
      httpStatusCode: status2.OK,
      success: true,
      message: "All orders fetched successfully",
      data: result
    });
  } catch (error) {
    sendResponse(res, {
      httpStatusCode: status2.BAD_REQUEST,
      success: false,
      message: "Error fetching all orders"
    });
  }
});
var updateStatus2 = catchAsync(async (req, res) => {
  try {
    const id = req.params.id;
    const result = await sellerServices.updateStatus(req.body, id);
    sendResponse(res, {
      httpStatusCode: status2.OK,
      success: true,
      message: "Order status updated successfully",
      data: result
    });
  } catch (error) {
    sendResponse(res, {
      httpStatusCode: status2.BAD_REQUEST,
      success: false,
      message: "Error updating order status"
    });
  }
});
var sellerController = {
  createMedicine: createMedicine2,
  updateMedicine: updateMedicine2,
  deleteMedicine: deleteMedicine2,
  getAllOrder: getAllOrder2,
  updateStatus: updateStatus2
};

// src/module/seller/seller.route.ts
var router3 = express3.Router();
router3.post("/medicines", auth2(Role.SELLER, Role.ADMIN), sellerController.createMedicine);
router3.put("/medicines/:id", auth2(Role.SELLER, Role.ADMIN), sellerController.updateMedicine);
router3.delete("/medicines/:id", auth2(Role.SELLER, Role.ADMIN), sellerController.deleteMedicine);
router3.get("/orders", auth2(Role.SELLER, Role.ADMIN), sellerController.getAllOrder);
router3.patch("/orders/:id", auth2(Role.SELLER, Role.ADMIN), sellerController.updateStatus);
var sellerRouter = router3;

// src/module/orders/orders.route.ts
import express4 from "express";

// src/config/stripe.config.ts
import Stripe from "stripe";
var stripe = new Stripe(envVars.STRIPE_SECRET_KEY);

// src/module/orders/orders.service.ts
import { v7 as uuidv7 } from "uuid";
var createOrder = async (payload, userId) => {
  const medicineExists = await prisma.medicine.findUnique({
    where: {
      id: payload.medicineId
    }
  });
  if (!medicineExists) {
    throw new Error("Medicine is not Found! Try again later");
  }
  if (medicineExists?.stock < payload.quantity) {
    throw new Error("Insufficient medicine stock!");
  }
  const medicine = await prisma.medicine.update({
    where: {
      id: payload.medicineId
    },
    data: {
      stock: {
        decrement: payload.quantity
      }
    }
  });
  const result = await prisma.$transaction(async (tx) => {
    const transactionId = String(uuidv7());
    const orderData = await prisma.order.create({
      data: {
        userId,
        medicineId: payload.medicineId,
        orderStatus: OrderStatus.PENDING,
        quantity: payload.quantity,
        totalAmount: (medicine?.price ?? 0) * payload.quantity,
        addressId: payload.addressId
      }
    });
    const paymentData = await tx.payment.create({
      data: {
        amount: (medicine?.price ?? 0) * payload.quantity,
        transactionId,
        orderId: orderData.id,
        userId
      }
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: `Payment for Medicine ${medicine?.name}`
            },
            unit_amount: Math.round((medicine?.price ?? 0) * payload.quantity * 100)
            // amount in cents
          },
          quantity: 1
        }
      ],
      metadata: {
        orderId: orderData.id,
        paymentId: paymentData.id
      },
      success_url: `${envVars.APP_URL}/dashboard/payment/payment-success?order_id=${orderData.id}&payment_id=${paymentData.id}`,
      cancel_url: `${envVars.APP_URL}/dashboard/dashboard?error=payment_canceled`
    });
    return {
      orderData,
      paymentData,
      paymentUrl: session.url
    };
  });
  return {
    order: result.orderData,
    payment: result.paymentData,
    paymentUrl: result.paymentUrl
  };
};
var getAllOrder3 = async (id, page, limit) => {
  console.log("hi I am from getAllOrder");
  const data = await prisma.order.findMany({
    take: limit,
    skip: (page - 1) * limit,
    where: {
      userId: id
    }
  });
  console.log(data);
  const total = await prisma.order.count({
    where: {
      userId: id
    }
  });
  console.log(data);
  return { data, total, page, limit, totalPage: Math.ceil(total / limit) };
};
var getSingleOrder = async (id) => {
  const result = await prisma.order.findMany({
    where: {
      id
    }
  });
  return result;
};
var deleteOrder = async (id, userId) => {
  const result = await prisma.order.delete({
    where: {
      id,
      userId
    }
  });
  return result;
};
var orderService = {
  createOrder,
  getAllOrder: getAllOrder3,
  getSingleOrder,
  deleteOrder
};

// src/module/orders/orders.controller.ts
import status3 from "http-status";
var createOrder2 = catchAsync(
  async (req, res) => {
    const result = await orderService.createOrder(req.body, req.user?.id);
    sendResponse(res, {
      httpStatusCode: status3.OK,
      success: true,
      message: "Order created successfully",
      data: result
    });
  }
);
var getAllOrder4 = catchAsync(
  async (req, res) => {
    const id = req.user?.id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const result = await orderService.getAllOrder(id, page, limit);
    sendResponse(res, {
      httpStatusCode: status3.OK,
      success: true,
      message: "Order fetched successfully",
      data: result
    });
  }
);
var getSingleOrder2 = catchAsync(
  async (req, res) => {
    const id = req.params.id;
    const result = await orderService.getSingleOrder(id);
    sendResponse(res, {
      httpStatusCode: status3.OK,
      success: true,
      message: "Order fetched successfully",
      data: result
    });
  }
);
var deleteOrder2 = catchAsync(
  async (req, res) => {
    const id = req.params.id;
    const userId = req.user?.id;
    const result = await orderService.deleteOrder(id, userId);
    sendResponse(res, {
      httpStatusCode: status3.OK,
      success: true,
      message: "Order deleted successfully",
      data: result
    });
  }
);
var orderController = {
  createOrder: createOrder2,
  getAllOrder: getAllOrder4,
  getSingleOrder: getSingleOrder2,
  deleteOrder: deleteOrder2
};

// src/module/orders/order.validation.ts
import { z as z2 } from "zod";
var createOrderZodSchema = z2.object({
  medicineId: z2.string("You have to provide medecineId"),
  quantity: z2.number().min(1, "Quantity must be a positive number"),
  addressId: z2.string("You must provide addressId")
});

// src/module/orders/orders.route.ts
var route = express4.Router();
route.post("/", validateRequest(createOrderZodSchema), auth2(Role.CUSTOMER), orderController.createOrder);
route.get("/", auth2(Role.CUSTOMER, Role.SELLER, Role.ADMIN), orderController.getAllOrder);
route.get("/:id", auth2(Role.CUSTOMER, Role.SELLER, Role.ADMIN), orderController.getSingleOrder);
route.delete("/:id", auth2(Role.CUSTOMER, Role.SELLER, Role.ADMIN), orderController.deleteOrder);
var orderRoute = route;

// src/module/admin/admin.route.ts
import express5 from "express";

// src/module/admin/admin.service.ts
var getAllUser = async (page, limit) => {
  const data = await prisma.user.findMany({
    take: limit,
    skip: (page - 1) * limit
  });
  const totalUser = await prisma.user.count();
  return { data, page, limit, totalUser, totalPage: Math.ceil(totalUser / limit) };
};
var updateUserStatus = async (payload, id) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id
    }
  });
  const result = await prisma.user.update({
    where: {
      id
    },
    data: {
      userStatus: payload.userStatus
    }
  });
  return result;
};
var getStats = async () => {
  return await prisma.$transaction(async (tx) => {
    const [totalUser, totalCustomer, totalSeller, totalOrder, totalOrderAmount, totalMedicine, totalCategory] = await Promise.all([
      await prisma.user.count(),
      await prisma.user.count({ where: { role: Role.CUSTOMER } }),
      await prisma.user.count({ where: { role: Role.SELLER } }),
      await prisma.order.count(),
      await prisma.order.aggregate({ _sum: { totalAmount: true } }),
      await prisma.medicine.count(),
      await prisma.category.count()
    ]);
    return {
      totalUser,
      totalCustomer,
      totalSeller,
      totalOrder,
      totalOrderAmount: totalOrderAmount._sum.totalAmount,
      totalMedicine,
      totalCategory
    };
  });
};
var adminService = {
  getAllUser,
  updateUserStatus,
  getStats
};

// src/module/admin/admin.controller.ts
var getAllUser2 = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const result = await adminService.getAllUser(page, limit);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var updateUserStatus2 = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await adminService.updateUserStatus(req.body, id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var getStats2 = async (req, res) => {
  try {
    const result = await adminService.getStats();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var adminController = {
  getAllUser: getAllUser2,
  updateUserStatus: updateUserStatus2,
  getStats: getStats2
};

// src/module/admin/admin.route.ts
var router4 = express5.Router();
router4.get("/users", auth2(Role.ADMIN), adminController.getAllUser);
router4.get("/stats", auth2(Role.ADMIN, Role.SELLER), adminController.getStats);
router4.patch("/users/:id", auth2(Role.ADMIN), adminController.updateUserStatus);
var adminRoute = router4;

// src/module/customer/customer.route.ts
import express6 from "express";

// src/module/customer/customer.service.ts
var getMyProfile = async (id) => {
  const res = await prisma.user.findUniqueOrThrow({
    where: {
      id
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true
    }
  });
  const addressInfo = await prisma.address.findUnique({
    where: {
      userId: res.id
    },
    select: {
      fullName: true,
      phone: true,
      city: true,
      area: true,
      street: true,
      houseNo: true,
      postalCode: true
    }
  });
  return {
    user: res,
    address: addressInfo
  };
};
var getMyOrder = async (id) => {
  const res = await prisma.order.findMany({
    where: {
      userId: id
    },
    include: {
      medicine: {
        select: {
          name: true,
          price: true,
          categoryName: true
        }
      }
    }
  });
  return res;
};
var editMyProfile = async (payload, userId) => {
  const res = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      name: payload.name,
      email: payload.email
    }
  });
  return res;
};
var getSingleOrder3 = async (id) => {
  const res = await prisma.order.findUniqueOrThrow({
    where: {
      id
    }
  });
  return res;
};
var addShippingAddress = async (payload, userId) => {
  const user = await prisma.address.update({
    where: {
      userId
    },
    data: {
      city: payload.city
    }
  });
  console.log(user);
  return user;
};
var AddItemToCard = async (payload, userId) => {
  const res = await prisma.cart.upsert({
    where: {
      userId_medicineId: {
        userId,
        medicineId: payload.medicineId
      }
    },
    update: {
      quantity: {
        increment: 1
      }
    },
    create: {
      userId,
      medicineId: payload.medicineId
    }
  });
  return res;
};
var getMyCartItem = async (userId) => {
  const cartItem = await prisma.cart.findMany({
    where: {
      userId
    }
  });
  return cartItem;
};
var getMySingleCartItem = async (id) => {
  const cartItem = await prisma.cart.findUnique({
    where: {
      id
    }
  });
  return cartItem;
};
var DecrementCartItem = async (payload, userId) => {
  const checkItem = await prisma.cart.findUnique({
    where: {
      userId_medicineId: {
        userId,
        medicineId: payload.medicineId
      }
    }
  });
  if (checkItem?.quantity === 0 || checkItem?.quantity === null) {
    throw new Error("Quantity Cannot be Negative");
  }
  const res = await prisma.cart.upsert({
    where: {
      userId_medicineId: {
        userId,
        medicineId: payload.medicineId
      }
    },
    update: {
      quantity: {
        decrement: 1
      }
    },
    create: {
      userId,
      medicineId: payload.medicineId
    }
  });
  return res;
};
var deleteCartItem = async (id) => {
  const res = await prisma.cart.delete({
    where: {
      id
    }
  });
  return res;
};
var createAddress = async (payload, userId) => {
  const res = await prisma.address.create({
    data: {
      ...payload,
      userId
    }
  });
  return res;
};
var updateAddress = async (payload, userId) => {
  console.log(payload);
  const updateAddress3 = await prisma.address.upsert({
    where: {
      userId
    },
    update: {
      ...payload
    },
    create: {
      ...payload,
      userId
    }
  });
  console.log(updateAddress3);
  return updateAddress3;
};
var getMyAddress = async (userId) => {
  const res = await prisma.address.findUniqueOrThrow({
    where: {
      userId
    }
  });
  return res;
};
var createReview = async (payload, userId) => {
  console.log("payload ", payload);
  console.log(userId);
  await prisma.user.findUniqueOrThrow({
    where: {
      id: userId
    }
  });
  const res = await prisma.review.create({
    data: {
      ...payload,
      userId
    }
  });
  console.log("res ", res);
  return res;
};
var getReview = async (userId) => {
  const res = await prisma.review.findMany({
    where: {
      userId
    }
  });
  return res;
};
var getSingleMedicineReview = async (medicineId) => {
  const res = await prisma.review.findMany({
    where: {
      medicineId
    }
  });
  return res;
};
var customerService = {
  getMyProfile,
  getMyOrder,
  editMyProfile,
  getSingleOrder: getSingleOrder3,
  addShippingAddress,
  AddItemToCard,
  getMyCartItem,
  getMySingleCartItem,
  DecrementCartItem,
  deleteCartItem,
  createAddress,
  updateAddress,
  getMyAddress,
  createReview,
  getReview,
  getSingleMedicineReview
};

// src/module/customer/customer.controller.ts
var getMyProfile2 = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "You are not Authorized"
      });
    }
    const { id } = req.user;
    const result = await customerService.getMyProfile(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var getMyOrder2 = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "You are not Authorized"
      });
    }
    const { id } = req.user;
    const result = await customerService.getMyOrder(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var editMyProfile2 = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "You are not Authorized"
      });
    }
    const userId = req.user.id;
    const result = await customerService.editMyProfile(req.body, userId);
    console.log(result);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var getSingleOrder4 = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "You are not Authorized"
      });
    }
    const id = req.params.id;
    const result = await customerService.getSingleOrder(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var addShippingAddress2 = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "You are not Authorized"
      });
    }
    const userId = req.user.id;
    const result = await customerService.addShippingAddress(req.body, userId);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var AddItemToCard2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).json({
        message: false,
        error: "Please Login to Add Item in your Cart"
      });
    }
    const userId = req.user?.id;
    const result = await customerService.AddItemToCard(req.body, userId);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var DecrementCartItem2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).json({
        message: false,
        error: "Please Login to Add Item in your Cart"
      });
    }
    const userId = req.user?.id;
    const result = await customerService.DecrementCartItem(req.body, userId);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var getMyCartItem2 = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "You are not Authorized"
      });
    }
    const userId = req.user.id;
    const result = await customerService.getMyCartItem(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var getMySingleCartItem2 = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "You are not Authorized"
      });
    }
    const userId = req.user.id;
    const { id } = req.params;
    const result = await customerService.getMySingleCartItem(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var deleteCartItem2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).json({
        message: false,
        error: "Please Login to Add Item in your Cart"
      });
    }
    const id = await req.params.id;
    const result = await customerService.deleteCartItem(id);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var createAddress2 = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "You are not Authorized"
      });
    }
    const userId = req.user.id;
    const result = await customerService.createAddress(req.body, userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var getMyAddress2 = async (req, res) => {
  try {
    console.log("hi");
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "You are not Authorized"
      });
    }
    const userId = req.user.id;
    const result = await customerService.getMyAddress(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var updateAddress2 = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "You are not Authorized"
      });
    }
    const userId = req.user.id;
    const result = await customerService.updateAddress(req.body, userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var createReview2 = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "You are not Unauthorized"
      });
    }
    const userId = req.user.id;
    const result = await customerService.createReview(req.body, userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var getReview2 = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "You are not Authorized"
      });
    }
    const userId = req.user.id;
    const result = await customerService.getReview(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var getSingleMedicineReview2 = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "You are not Authorized"
      });
    }
    const { medicineId } = req.params;
    console.log(medicineId);
    const result = await customerService.getSingleMedicineReview(medicineId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var customerController = {
  getMyProfile: getMyProfile2,
  getMyOrder: getMyOrder2,
  editMyProfile: editMyProfile2,
  getSingleOrder: getSingleOrder4,
  addShippingAddress: addShippingAddress2,
  AddItemToCard: AddItemToCard2,
  getMyCartItem: getMyCartItem2,
  getMySingleCartItem: getMySingleCartItem2,
  DecrementCartItem: DecrementCartItem2,
  deleteCartItem: deleteCartItem2,
  createAddress: createAddress2,
  updateAddress: updateAddress2,
  getMyAddress: getMyAddress2,
  createReview: createReview2,
  getReview: getReview2,
  getSingleMedicineReview: getSingleMedicineReview2
};

// src/module/customer/customer.validation.ts
import z3 from "zod";
var createAddressZodSchema = z3.object({
  fullName: z3.string().min(1, "Full name is required").max(20, "Full name must be less than 20 characters").optional(),
  phone: z3.string().min(11, "Phone number must be at least 11 characters").max(14, "Phone number must be less than 14 characters").optional()
}).partial();
var createReviewZodSchema = z3.object({
  medicineId: z3.string().min(1, "Medicine ID is required"),
  description: z3.string().min(1, "Description is required").max(500, "Description must be less than 500 characters")
});

// src/module/customer/customer.route.ts
var router5 = express6.Router();
router5.get("/me", auth2(Role.CUSTOMER, Role.ADMIN, Role.SELLER), customerController.getMyProfile);
router5.get("/orders", auth2(Role.CUSTOMER), customerController.getMyOrder);
router5.get("/orders/:id", auth2(Role.CUSTOMER), customerController.getSingleOrder);
router5.post("/cart", auth2(Role.CUSTOMER), customerController.AddItemToCard);
router5.post("/decrement", auth2(Role.CUSTOMER), customerController.DecrementCartItem);
router5.get("/cart", auth2(Role.CUSTOMER), customerController.getMyCartItem);
router5.get("/cart/:id", auth2(Role.CUSTOMER), customerController.getMySingleCartItem);
router5.put("/profile", auth2(Role.CUSTOMER), customerController.editMyProfile);
router5.put("/checkout", auth2(Role.CUSTOMER), customerController.addShippingAddress);
router5.delete("/:id", auth2(Role.CUSTOMER), customerController.deleteCartItem);
router5.post("/address", validateRequest(createAddressZodSchema), auth2(Role.CUSTOMER), customerController.createAddress);
router5.put("/update-my-address", auth2(Role.CUSTOMER), customerController.updateAddress);
router5.post("/review", auth2(Role.CUSTOMER), validateRequest(createReviewZodSchema), customerController.createReview);
router5.get("/review", auth2(Role.CUSTOMER, Role.ADMIN, Role.SELLER), customerController.getReview);
router5.get("/review/:medicineId", auth2(Role.CUSTOMER, Role.ADMIN, Role.SELLER), customerController.getSingleMedicineReview);
router5.get("/my-address", auth2(Role.CUSTOMER), customerController.getMyAddress);
var customerRouter = router5;

// src/app.ts
import cookieParser from "cookie-parser";

// src/module/payment/payment.route.ts
import { Router as Router7 } from "express";
var router6 = Router7();
var payment_route_default = router6;

// src/module/payment/payment.service.ts
var handlerStripeWebhookEvent = async (userId, event) => {
  const existingPayment = await prisma.payment.findFirst({
    where: {
      stripeEventId: event.id
    }
  });
  if (existingPayment) {
    return { message: `Event ${event.id} already processed` };
  }
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      const paymentId = session.metadata?.paymentId;
      if (!orderId || !paymentId) {
        console.error("Missing orderId or paymentId in session metadata");
        return { message: "Missing orderId or paymentId in session metadata" };
      }
      const order = await prisma.order.findUnique({
        where: {
          id: orderId
        }
      });
      if (!order) {
        console.error(`Order with ID ${orderId} not found`);
        return { message: `Order with ID ${orderId} not found` };
      }
      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: {
            id: paymentId
          },
          data: {
            status: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID,
            stripeEventId: event.id
          }
        });
        const orderData = await tx.order.update({
          where: {
            id: orderId
          },
          data: {
            paymentStatus: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID,
            orderStatus: OrderStatus.CONFIRMED
          }
        });
        await tx.cart.deleteMany({
          where: {
            medicineId: orderData.medicineId,
            userId: orderData.userId
          }
        });
      });
      console.log(`Processed checkout.session.completed for appointment ${orderId} and payment ${paymentId}`);
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object;
      console.log(`Checkout session ${session.id} expired. Marking associated payment as failed.`);
      break;
    }
    case "payment_intent.payment_failed": {
      const session = event.data.object;
      console.log(`Payment intent ${session.id} failed. Marking associated payment as failed.`);
      break;
    }
    default:
      return { message: `Unhandled event type: ${event.type}` };
  }
};
var PaymentService = {
  handlerStripeWebhookEvent
};

// src/module/payment/payment.controller.ts
import status4 from "http-status";
var handleStripeWebhookEvent = catchAsync(
  async (req, res) => {
    const signature = req.headers["stripe-signature"];
    const webhookSecret = envVars.STRIPE_WEBHOOK_SECRET;
    if (!signature || !webhookSecret) {
      console.error("Missing Stripe signature or webhook secret");
      sendResponse(res, {
        httpStatusCode: status4.BAD_REQUEST,
        success: false,
        message: "Missing Stripe signature or webhook secret"
      });
    }
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    } catch (error) {
      console.error("Error processing Stripe webhook:", error);
      sendResponse(res, {
        httpStatusCode: status4.BAD_REQUEST,
        success: false,
        message: "Error processing Stripe webhook"
      });
    }
    try {
      const result = await PaymentService.handlerStripeWebhookEvent(req.user?.id, event);
      sendResponse(res, {
        httpStatusCode: status4.OK,
        success: true,
        message: "Stripe webhook event processed successfully",
        data: result
      });
    } catch (error) {
      console.error("Error handling Stripe webhook event:", error);
      sendResponse(res, {
        httpStatusCode: status4.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Error handling Stripe webhook event"
      });
    }
  }
);
var PaymentController = {
  handleStripeWebhookEvent
};

// src/middlewares/globalErrorHandler.ts
import status7 from "http-status";
import z4 from "zod";

// src/errorHelper/handleZodError.ts
import status5 from "http-status";
var handleZodError = (err) => {
  const statusCode = status5.BAD_REQUEST;
  const message = "Zod Validation Error from globalErrorHandler";
  const errorSource = [];
  err.issues.forEach((issue) => {
    errorSource.push({
      path: issue.path.join("."),
      message: issue.message
    });
  });
  return {
    success: false,
    message,
    errorSources: errorSource,
    statusCode
  };
};

// src/config/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";
import status6 from "http-status";
cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET
});
var deleteFileFromCloudinary = async (url) => {
  try {
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
    const match = url.match(regex);
    if (match && match[1]) {
      const publicId = match[1];
      await cloudinary.uploader.destroy(
        publicId,
        {
          resource_type: "image"
        }
      );
    }
  } catch (error) {
    console.error("Error deleting file from Cloudinary", error);
    throw new AppError_default(status6.INTERNAL_SERVER_ERROR, "Failed to delete file from Cloudinary");
  }
};

// src/middlewares/globalErrorHandler.ts
var globalErrorHandler = async (err, req, res, next) => {
  if (envVars.NODE_ENV === "development") {
    console.error("Error from global error handler : ", err);
  }
  if (req.file) {
    await deleteFileFromCloudinary(req.file.path);
  }
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const imageUrls = req.files.map((file) => file.path);
    await Promise.all(imageUrls.map((url) => deleteFileFromCloudinary(url)));
  }
  let errorSources = [];
  let statusCode = status7.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let stack = void 0;
  if (err instanceof z4.ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode || status7.BAD_REQUEST;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof AppError_default) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "I am from global error handler and I am an instance of AppError",
        message: err.message
      }
    ];
  } else if (err instanceof Error) {
    statusCode = status7.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "I am from global error handler and I am an instance of Error",
        message: err.message
      }
    ];
  }
  const errorResponse = {
    success: false,
    message,
    errorSources,
    stack: envVars.NODE_ENV === "development" ? stack : void 0,
    error: envVars.NODE_ENV === "development" ? err : void 0
  };
  res.status(statusCode).json(errorResponse);
};

// src/middlewares/notFound.ts
import status8 from "http-status";
var notFoundHandler = (req, res) => {
  res.status(status8.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};

// src/app.ts
import { toNodeHandler } from "better-auth/node";
var app = express7();
app.use(cookieParser());
app.use(cors({
  origin: envVars.APP_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express7.urlencoded({ extended: true }));
app.post("/api/auth/sign-in/email", async (req, res, next) => {
  try {
    const users = await prisma.user.updateMany({
      where: {
        role: Role.CUSTOMER,
        emailVerified: false,
        isDeleted: false
      },
      data: {
        emailVerified: true
      }
    });
    console.log(users);
  } catch (error) {
    console.log("Failed to update customer from isverified to verified", error);
  }
  next();
});
app.all("/api/auth/*splat", toNodeHandler(auth));
app.post("/webhook", express7.raw({ type: "application/json" }), PaymentController.handleStripeWebhookEvent);
app.use(express7.json());
app.use("/api/payment", payment_route_default);
app.use("/api/customer", customerRouter);
app.use("/api/categories", categoryRoute);
app.use("/api/medicines", medicineRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/orders", orderRoute);
app.use("/api/admin", adminRoute);
app.get("/", (req, res) => {
  res.send("Hello World !!");
});
app.use(globalErrorHandler);
app.use(notFoundHandler);
var app_default = app;

// src/server.ts
async function main() {
  try {
    await prisma.$connect();
    console.log("Database connection successfully");
    app_default.listen(envVars.PORT, () => {
      console.log(`Server is running on http://localhost:${envVars.PORT}`);
    });
  } catch (error) {
    console.log("error => ", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
//! customer
//! medicine
//! seller
//! orders
//! admin
