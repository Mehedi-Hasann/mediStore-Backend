import { Request, Response } from "express";
import { orderService } from "./orders.service";
import { Order } from "../../generated/client";
import { catchAsync } from "../../shared/catchAsync";
import status from "http-status";
import { sendResponse } from "../../shared/sendResponse";

const createOrder = catchAsync(async(req: Request, res: Response) => {

    const result = await orderService.createOrder(req.body as Order, req.user?.id as string);

    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "Order created successfully",
      data : result
    })
  } 
)

const getAllOrder = catchAsync(async(req: Request, res: Response) => {
  
    // console.log(req.user);
    const id = req.user?.id as string | undefined;
    // console.log(id);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    // console.log(page, limit);
    const result = await orderService.getAllOrder(id as string, page, limit);

    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "Order fetched successfully",
      data : result
    })
  } 
)

const getSingleOrder = catchAsync(async(req: Request, res: Response) => {
  
    const id = req.params.id;
    // console.log(id);
    const result = await orderService.getSingleOrder(id as string);

    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "Order fetched successfully",
      data : result
    })
  } 
)

const deleteOrder = catchAsync(async(req: Request, res: Response) => {
  
    const id = req.params.id;
    const userId = req.user?.id;
    const result = await orderService.deleteOrder(id as string, userId as string);

    sendResponse(res, {
      httpStatusCode : status.OK,
      success : true,
      message : "Order deleted successfully",
      data : result
    })
  } 
)

export const orderController = {
  createOrder, getAllOrder, getSingleOrder, deleteOrder
}