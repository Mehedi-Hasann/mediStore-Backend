import express, { Router } from "express"
import { categoryController } from "./category.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../generated/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { createCategoryZodSchema } from "./category.validation";

const router = express.Router();

router.get('/', categoryController.getAllCategory);
router.get('/:categoryName', categoryController.getCategory);
router.post('/',auth(Role.SELLER,Role.ADMIN), validateRequest(createCategoryZodSchema) ,categoryController.createCategory);

export const categoryRoute: Router =  router;