import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { UserService } from "./user.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import AppError from "../../errorHelper/AppError";

const createSeller = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await UserService.createSeller(payload);

    sendResponse(res, {
      httpStatusCode : status.CREATED,
      success: true,
      message: "Seller created successfully",
      data: result,
    })
  }
)

const createAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await UserService.createAdmin(payload);

    sendResponse(res, {
      httpStatusCode : status.CREATED,
      success: true,
      message: "Admin created successfully",
      data: result,
    })
  }
)

export const UserController = {
  createSeller,
  createAdmin
}