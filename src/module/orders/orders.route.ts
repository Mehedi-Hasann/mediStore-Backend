import express, { Router } from "express";
import { orderController } from "./orders.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../generated/enums";
import { createOrderZodSchema } from "./order.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const route = express.Router();

route.post("/", validateRequest(createOrderZodSchema), auth(Role.CUSTOMER), orderController.createOrder);

route.get("/",auth(Role.CUSTOMER,Role.SELLER,Role.ADMIN),orderController.getAllOrder);

route.get("/:id",auth(Role.CUSTOMER,Role.SELLER,Role.ADMIN),orderController.getSingleOrder);

route.delete("/:id",auth(Role.CUSTOMER,Role.SELLER,Role.ADMIN),orderController.deleteOrder);


export const orderRoute: Router = route