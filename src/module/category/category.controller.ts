import { Request, Response } from "express";
import { categoryService } from "./category.service";

const createCategory = async(req: Request, res: Response) => {
  try {
    const result = await categoryService.createCategory(req.body);

    res.status(201).json(result);
  } catch (error) {
    res.send(error)
  }
}

const getCategory = async(req: Request, res: Response) => {
  try {
    const {categoryName} = req.params;
    const result = await categoryService.getCategory(categoryName as string);

    res.status(500).json(result);

  } catch (error) {
    console.log("Category is not found");
    res.status(404).json(error)
  }

}

const getAllCategory = async(req: Request, res: Response) => {
  try {
    const result = await categoryService.getAllCategory();
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json(error)
  }
}

export const categoryController = {
  createCategory, getCategory, getAllCategory
}