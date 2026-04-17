import express, { Application, Request, Response } from "express";
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
import { envVars } from "./config/env";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFoundHandler } from "./middlewares/notFound";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app : Application= express();


app.use(cookieParser());

app.use(cors({
  origin : envVars.APP_URL || "http://localhost:3000",
  credentials : true
}))

app.use(express.urlencoded({ extended: true }));



app.all('/api/auth/*splat', toNodeHandler(auth));

app.post("/webhook", express.raw({ type: "application/json" }), PaymentController.handleStripeWebhookEvent)

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

app.get("/", (req: Request,res: Response) => {
  res.send("Hello World !!");
})

app.use(globalErrorHandler);
app.use(notFoundHandler)


export default app