import express from "express"
import { categoryController } from "./category.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../constants/enum";

const router = express.Router();

router.get('/',auth(UserRole.CUSTOMER,UserRole.SELLER,UserRole.ADMIN),categoryController.getAllCategory);
router.get('/:categoryName',auth(UserRole.SELLER,UserRole.ADMIN),categoryController.getCategory);
router.post('/',auth(UserRole.SELLER,UserRole.ADMIN),categoryController.createCategory);

export const categoryRoute =  router;