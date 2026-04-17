import express, { Router } from "express";
import { sellerController } from "./seller.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../generated/enums";

const router = express.Router();

router.post("/medicines",auth(Role.SELLER, Role.ADMIN),sellerController.createMedicine);
router.put("/medicines/:id",auth(Role.SELLER,Role.ADMIN),sellerController.updateMedicine);
router.delete("/medicines/:id",auth(Role.SELLER,Role.ADMIN),sellerController.deleteMedicine);
router.get("/orders",auth(Role.SELLER,Role.ADMIN),sellerController.getAllOrder);
router.patch("/orders/:id",auth(Role.SELLER, Role.ADMIN),sellerController.updateStatus);

export const sellerRouter: Router = router