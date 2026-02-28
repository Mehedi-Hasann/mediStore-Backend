import express from "express"
import { customerController } from "./customer.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../constants/enum";
const router = express.Router();

router.get('/me',auth(UserRole.CUSTOMER),customerController.getMyProfile);
router.get('/orders',auth(UserRole.CUSTOMER),customerController.getMyOrder);
router.get('/orders/:id',auth(UserRole.CUSTOMER),customerController.getSingleOrder);

router.post('/cart',auth(UserRole.CUSTOMER),customerController.AddItemToCard);
router.post('/decrement',auth(UserRole.CUSTOMER),customerController.DecrementCartItem);

router.get('/cart',auth(UserRole.CUSTOMER),customerController.getMyCartItem);
router.get('/cart/:id',auth(UserRole.CUSTOMER),customerController.getMySingleCartItem);
router.put('/profile',auth(UserRole.CUSTOMER),customerController.editMyProfile);
router.put('/checkout',auth(UserRole.CUSTOMER),customerController.addShippingAddress);
router.delete('/:id',auth(UserRole.CUSTOMER),customerController.deleteCartItem);

router.post('/address',auth(UserRole.CUSTOMER),customerController.createAddress);
router.post('/review',auth(UserRole.CUSTOMER),customerController.createReview);
router.get('/review',auth(UserRole.CUSTOMER,UserRole.ADMIN,UserRole.SELLER),customerController.getReview);
router.get('/review/:medicineId',auth(UserRole.CUSTOMER,UserRole.ADMIN,UserRole.SELLER),customerController.getSingleMedicineReview);
router.get('/my-address',auth(UserRole.CUSTOMER),customerController.getMyAddress);



export const customerRouter = router