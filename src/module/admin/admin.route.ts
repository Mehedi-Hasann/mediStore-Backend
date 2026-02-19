import express from "express"
import { adminController } from "./admin.controller";
import { UserRole } from "../../constants/enum";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.get("/users",auth(UserRole.ADMIN),adminController.getAllUser);
router.patch("/users/:id",auth(UserRole.ADMIN),adminController.updateUserStatus);

export const adminRoute = router