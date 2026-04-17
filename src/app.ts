import express, { Application, NextFunction, Request, Response } from "express";
import { medicineRouter } from "./module/medicine/medicine.route";
import { categoryRoute } from "./module/category/category.route";
import cors from "cors"
import { sellerRouter } from "./module/seller/seller.route";
import { orderRoute } from "./module/orders/orders.route";
import { adminRoute } from "./module/admin/admin.route";
import { customerRouter } from "./module/customer/customer.route";
import cookieParser from "cookie-parser";
import paymentRoute from "./module/payment/payment.route";
import { PaymentController } from "./module/payment/payment.controller";
import { AuthRoutes } from "./module/auth/auth.route";
import { envVars } from "./config/env";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFoundHandler } from "./middlewares/notFound";
import { UserRoutes } from "./module/user/user.route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { prisma } from "./lib/prisma";
import { Role } from "./generated/enums";

const app : Application= express();


app.use(cookieParser());

app.use(cors({
  origin : envVars.APP_URL || "http://localhost:3000",
  credentials : true
}))

app.use(express.urlencoded({ extended: true }));



app.post('/api/auth/sign-in/email', async(req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.updateMany({
      where : {
        role : Role.CUSTOMER,
        emailVerified : false,
        isDeleted : false
      },
      data : {
        emailVerified : true
      }
    })
    console.log(users)
  } catch (error) {
    console.log("Failed to update customer from isverified to verified",error)
  }
  next()
})

app.all('/api/auth/*splat', toNodeHandler(auth));

app.post("/webhook", express.raw({ type: "application/json" }), PaymentController.handleStripeWebhookEvent)
// app.use('/auth', AuthRoutes);
app.use(express.json());
app.use("/api/payment", paymentRoute);

//! customer
app.use("/api/customer",customerRouter);

//! medicine
app.use("/api/categories",categoryRoute);
app.use("/api/medicines",medicineRouter);

//! seller
app.use("/api/seller",sellerRouter);

//! orders
app.use("/api/orders",orderRoute);

//! admin
app.use("/api/admin",adminRoute);

// app.use("/api/user", UserRoutes);

app.get("/", (req: Request,res: Response) => {
  res.send("Hello World !!");
})

app.use(globalErrorHandler);
app.use(notFoundHandler)


export default app