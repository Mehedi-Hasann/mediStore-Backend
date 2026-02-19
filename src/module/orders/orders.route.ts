import express from "express";
import { orderController } from "./orders.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../constants/enum";

const route = express.Router();

route.post("/",auth(UserRole.ADMIN,UserRole.CUSTOMER,UserRole.SELLER),orderController.createOrder);
route.get("/",auth(UserRole.SELLER,UserRole.ADMIN),orderController.getAllOrder);
route.get("/:id",orderController.getSingleOrder);


export const orderRoute = route