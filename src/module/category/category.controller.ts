import { Request, Response } from "express";
import { categoryService } from "./category.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const createCategory = catchAsync(
  async(req: Request, res: Response) => {
    const result = await categoryService.createCategory(req.body);
    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "Category created successfully",
      data : result
    })
  }
)

const getCategory = catchAsync(
  async(req: Request, res: Response) => {
    const {categoryName} = req.params;
    const result = await categoryService.getSingleCategory(categoryName as string);
    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "Category fetched successfully",
      data : result
    })
  }
)

const getAllCategory = catchAsync(
  async(req: Request, res: Response) => {
    const result = await categoryService.getAllCategory();
    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "Categories fetched successfully",
      data : result
    })
  }
)

export const categoryController = {
  createCategory, getCategory, getAllCategory
}