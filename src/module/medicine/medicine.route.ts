import express, { Router } from "express";
import { medicineController } from "./medicine.controller";

const router = express.Router();

router.get("/", medicineController.getAllMedicine);
router.get("/:id", medicineController.getMedicineById);

export const medicineRouter: Router =  router;