import express from "express";
import { sellerController } from "./seller.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../constants/enum";

const router = express.Router();

router.post("/medicines",auth(UserRole.SELLER, UserRole.ADMIN),sellerController.createMedicine);
router.put("/medicines/:id",auth(UserRole.SELLER,UserRole.ADMIN),sellerController.updateMedicine);
router.delete("/medicines/:id",auth(UserRole.SELLER,UserRole.ADMIN),sellerController.deleteMedicine);
router.get("/orders",auth(UserRole.SELLER,UserRole.ADMIN),sellerController.getAllOrder);
router.patch("/orders/:id",auth(UserRole.SELLER, UserRole.ADMIN),sellerController.updateStatus);

export const sellerRouter = router