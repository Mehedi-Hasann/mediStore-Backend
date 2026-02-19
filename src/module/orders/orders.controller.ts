import { Request, Response } from "express";
import { orderService } from "./orders.service";
import { Order } from "../../generated/client";

const createOrder = async(req: Request, res: Response) => {
  try {
    // console.log(req.body);
    // console.log(req.user?.id);
    const result = await orderService.createOrder(req.body as Order, req.user?.id as string);

    res.status(201).json(result);
  } catch (error : any) {
    res.status(404).json({
      success : false,
      message : error.message
    })
  }
}

const getAllOrder = async(req: Request, res: Response) => {
  try {
    // console.log(req.user);
    const id = req.user?.id as string | undefined;
    // console.log(id);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    // console.log(page, limit);
    const result = await orderService.getAllOrder(id as string, page, limit);

    res.status(200).json(result)
  } catch (error : any) {
    res.status(500).json({
      success : false,
      message : error.message
    })
  }
}

const getSingleOrder = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    // console.log(id);
    const result = await orderService.getSingleOrder(id as string);

    res.status(200).json(result)
  } catch (error : any) {
    res.status(500).json({
      success: false,
      message : error.message
    })
  }
}

export const orderController = {
  createOrder, getAllOrder, getSingleOrder
}