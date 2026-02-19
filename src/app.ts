import express, { NextFunction, Request, Response } from "express";
import { medicineRouter } from "./module/medicine/medicine.route";
import { categoryRoute } from "./module/category/category.route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors"
import { sellerRouter } from "./module/seller/seller.route";
import { orderRoute } from "./module/orders/orders.route";
import { adminRoute } from "./module/admin/admin.route";
import { customerRouter } from "./module/customer/customer.route";


const app = express();

app.use(cors({
  origin : process.env.APP_URL || "http://localhost:3000",
  credentials : true
}))

app.use(express.json());
app.use("/api/auth",customerRouter);

//! better auth
//! better auth main handler
app.all('/api/auth/*splat', toNodeHandler(auth));

//! register alias
// app.post('/api/auth/register', (req: Request, res: Response) => {
//   req.url = '/api/auth/sign-up/email';
//   toNodeHandler(auth)(req, res);
// });


//! customer


//! medicine
app.use("/api/categories",categoryRoute);
app.use("/api/medicines",medicineRouter);

//! seller
app.use("/api/seller",sellerRouter);

//! orders
app.use("/api/orders",orderRoute)

//! admin
app.use("/api/admin",adminRoute)


app.get("/", (req,res) => {
  res.send("Hello World !!");
})


export default app