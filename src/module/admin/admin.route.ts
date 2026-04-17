import express, { Router } from "express"
import { adminController } from "./admin.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../generated/enums";

const router = express.Router();

router.get("/users",auth(Role.ADMIN),adminController.getAllUser);
router.get("/stats",auth(Role.ADMIN, Role.SELLER),adminController.getStats);
router.patch("/users/:id",auth(Role.ADMIN),adminController.updateUserStatus);

export const adminRoute: Router = router