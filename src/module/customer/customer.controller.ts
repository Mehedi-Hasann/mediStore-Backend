import { Request, Response } from "express";
import { customerService } from "./customer.service";

const getMyProfile = async(req: Request, res : Response) => {
  try {
    // console.log(req.user);
    if(!req.user){
      return res.status(404).json({
        success : false,
        message : "You are not Authorized"
      })
    }
    const {id} = req.user;
    const result = await customerService.getMyProfile(id);
    // console.log(result);

    res.status(200).json(result);
  } catch (error : any) {
    res.status(500).json({
      success : false,
      message : error.message
    })
  }
}

const getMyOrder = async(req: Request, res : Response) => {
  try {
    // console.log(req.user);
    if(!req.user){
      return res.status(404).json({
        success : false,
        message : "You are not Authorized"
      })
    }
    const {id} = req.user;
    const result = await customerService.getMyOrder(id);
    // console.log(result);

    res.status(200).json(result);
  } catch (error : any) {
    res.status(500).json({
      success : false,
      message : error.message
    })
  }
}


const editMyProfile = async(req: Request, res : Response) => {
  try {
    // console.log(req.user);
    if(!req.user){
      return res.status(404).json({
        success : false,
        message : "You are not Authorized"
      })
    }
    const userId = req.user.id;
    const result = await customerService.editMyProfile(req.body ,userId as string);
    console.log(result);

    res.status(200).json({result});
  } catch (error : any) {
    res.status(500).json({
      success : false,
      message : error.message
    })
  }
}

const getSingleOrder = async(req: Request, res : Response) => {
  try {
    // console.log(req.user);
    if(!req.user){
      return res.status(404).json({
        success : false,
        message : "You are not Authorized"
      })
    }
    const id = req.params.id;
    const result = await customerService.getSingleOrder(id as string);
    // console.log(result);

    res.status(200).json(result);
  } catch (error : any) {
    res.status(500).json({
      success : false,
      message : error.message
    })
  }
}

export const customerController = {
  getMyProfile, getMyOrder, editMyProfile, getSingleOrder
}