import express from "express"
import { customerController } from "./customer.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../constants/enum";
const router = express.Router();

router.get('/me',auth(UserRole.CUSTOMER),customerController.getMyProfile);
router.get('/orders',auth(UserRole.CUSTOMER),customerController.getMyOrder);
router.get('/orders/:id',auth(UserRole.CUSTOMER),customerController.getSingleOrder);
router.post('/cart',auth(UserRole.CUSTOMER),customerController.AddItemToCard);
router.get('/cart',auth(UserRole.CUSTOMER),customerController.getMyCartItem);
router.put('/profile',auth(UserRole.CUSTOMER),customerController.editMyProfile);
router.put('/checkout',auth(UserRole.CUSTOMER),customerController.addShippingAddress);


export const customerRouter = router