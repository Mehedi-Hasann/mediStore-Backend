import { Request, Response } from "express";
import { sellerServices } from "./seller.service";
import { Medicine, Order } from "../../generated/client";


const createMedicine = async(req: Request, res : Response) => {
  try {
    res.send(req.body)
    const result = await sellerServices.createMedicine(req.body);


    res.status(201).json(result);
  } catch (error) {
    res.status(500).json(error)
  }
}

const updateMedicine = async(req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const result = await sellerServices.updateMedicine(req.body as Medicine, id as string);

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

const deleteMedicine = async(req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const result = await sellerServices.deleteMedicine(id as string);

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json(error)
  }
}

const getAllOrder = async(req: Request, res: Response) => {
  try {
    const result = await sellerServices.getAllOrder();

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({
      success : false,
      message : error.messaage
    })
  }
}

const updateStatus = async(req: Request, res: Response) => {
  try {
    // console.log('hi');
    const id = req.params.id;
    console.log(req.body);
    const result = await sellerServices.updateStatus(req.body as Order,id as string);

    res.status(200).json(result);
  } catch (error : any) {
    res.status(500).json({
      success : false,
      message : error.message
    })
  }
}

export const sellerController = {
  createMedicine, updateMedicine, deleteMedicine, getAllOrder, updateStatus
}