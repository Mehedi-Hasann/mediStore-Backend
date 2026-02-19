import express from "express"
import { customerController } from "./customer.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../constants/enum";
const router = express.Router();

router.get('/me',auth(UserRole.CUSTOMER),customerController.getMyProfile);
router.get('/orders',auth(UserRole.CUSTOMER),customerController.getMyOrder);
router.put('/profile',auth(UserRole.CUSTOMER),customerController.editMyProfile)

export const customerRouter = router