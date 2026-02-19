import express from "express";
import { medicineController } from "./medicine.controller";

const router = express.Router();

router.get("/", medicineController.getAllMedicine);
router.get("/:id", medicineController.getMedicineById);

export const medicineRouter =  router;