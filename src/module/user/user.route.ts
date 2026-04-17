import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createAdminZodSchema, createSellerZodSchema } from "./user.validation";

const router = Router();

router.post('/seller/create-seller',validateRequest(createSellerZodSchema) ,UserController.createSeller);
router.post('/admin/create-admin', validateRequest(createAdminZodSchema), UserController.createAdmin);

export const UserRoutes: Router = router;