import express from "express"
import { categoryController } from "./category.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../constants/enum";

const router = express.Router();

router.get('/', categoryController.getAllCategory);
router.get('/:categoryName', categoryController.getCategory);
router.post('/',auth(UserRole.ADMIN), categoryController.createCategory);

export const categoryRoute =  router;