import { Request, Response } from "express";
import { adminService } from "./admin.service";


const getAllUser = async(req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) ?? 1;
    const limit = Number(req.query.limit) ?? 5;
    const result = await adminService.getAllUser(page as number, limit as number);

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({
      success : false,
      message : error.message
    })
  }
}

const updateUserStatus = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await adminService.updateUserStatus(req.body ,id as string);

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({
      success : false,
      message : error.message
    })
  }
}

export const adminController = {
  getAllUser, updateUserStatus
}