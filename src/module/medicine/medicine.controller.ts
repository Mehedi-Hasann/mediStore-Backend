import { Request, Response } from "express";
import { medicineService } from "./medicine.service";
import { number } from "better-auth";

const getMedicineById = async(req: Request, res: Response) => {
  try {
    const result = await medicineService.getMedicineById(req.params.id as string);

    res.status(400).json(result)
  } catch (error) {
    res.status(404).json(error)
  }
}

const getAllMedicine = async(req: Request, res: Response) => {
  try {
    const {search} = req.query;
    const searchString = typeof search==="string" ? search : undefined;

    const {price} = req.query;
    const priceString = typeof price==='string' ? price : undefined;

    const {category} = req.query;
    const categoryString = typeof category==='string' ? category : undefined

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;

    const sortBy = (req.query.sortBy ?? "price") as string | undefined;
    const sortOrder = (req.query.sortOrder ?? "asc") as string | undefined;
    
    const result = await medicineService.getAllMedicine({search : searchString, price : priceString, category: categoryString, page, limit, sortBy, sortOrder});

    res.status(400).json(result)
  } catch (error) {
    res.status(404).json(error)
  }
}


export const medicineController = {
  getMedicineById, getAllMedicine
}