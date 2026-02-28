import { Request, Response } from "express";
import { customerService } from "./customer.service";

const getMyProfile = async(req: Request, res : Response) => {
  try {
    if(!req.user){
      return res.status(404).json({
        success : false,
        message : "You are not Authorized"
      })
    }
    const {id} = req.user;
    const result = await customerService.getMyProfile(id);

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

const addShippingAddress = async(req: Request, res : Response) => {
  try {
    // console.log(req.user);
    if(!req.user){
      return res.status(404).json({
        success : false,
        message : "You are not Authorized"
      })
    }
    // console.log(req.body);
    const userId = req.user.id;
    const result = await customerService.addShippingAddress(req.body ,userId as string);
    // console.log(result);

    res.status(200).json({result});
  } catch (error : any) {
    res.status(500).json({
      success : false,
      message : error.message
    })
  }
}

const AddItemToCard = async (req: Request, res : Response) => {
  try {
    const user = req.user;
    if(!user){
      res.status(404).json({
        message : false,
        error : "Please Login to Add Item in your Cart"
      })
    }

    const userId = req.user?.id;
    const result = await customerService.AddItemToCard(req.body, userId as string);

    res.status(201).json(result);

  } catch (error : any) {
    res.status(500).json({
      success : false,
      message : error.message
    })
  }
}

const DecrementCartItem = async (req: Request, res : Response) => {
  try {
    const user = req.user;
    // console.log(user);
    if(!user){
      res.status(404).json({
        message : false,
        error : "Please Login to Add Item in your Cart"
      })
    }
    // console.log(req.body);

    const userId = req.user?.id;
    const result = await customerService.DecrementCartItem(req.body, userId as string);
    console.log(result);

    res.status(201).json(result);

  } catch (error : any) {
    res.status(500).json({
      success : false,
      message : error.message
    })
  }
}

const getMyCartItem = async(req: Request, res : Response) => {
  try {
    // console.log(req.user);
    if(!req.user){
      return res.status(404).json({
        success : false,
        message : "You are not Authorized"
      })
    }
    const userId = req.user.id;
    const result = await customerService.getMyCartItem(userId);
    console.log(result);

    res.status(200).json(result);
  } catch (error : any) {
    res.status(500).json({
      success : false,
      message : error.message
    })
  }
}

const getMySingleCartItem = async(req: Request, res : Response) => {
  try {
    // console.log(req.user);
    if(!req.user){
      return res.status(404).json({
        success : false,
        message : "You are not Authorized"
      })
    }
    const userId = req.user.id;
    const {id} = req.params;
    const result = await customerService.getMySingleCartItem(id as string);

    res.status(200).json(result);
  } catch (error : any) {
    res.status(500).json({
      success : false,
      message : error.message
    })
  }
}

const deleteCartItem = async (req: Request, res : Response) => {
  try {
    const user = req.user;
    if(!user){
      res.status(404).json({
        message : false,
        error : "Please Login to Add Item in your Cart"
      })
    }
    const id = await req.params.id;
    const result = await customerService.deleteCartItem(id as string);
    // console.log(result);

    res.status(201).json(result);

  } catch (error : any) {
    res.status(500).json({
      success : false,
      message : error.message
    })
  }
}

const createAddress = async(req: Request, res : Response) => {
  try {
    // console.log('hi');

    if(!req.user){
      return res.status(404).json({
        success : false,
        message : "You are not Authorized"
      })
    }
    // console.log(req.body);

    const userId = req.user.id as string ;
    const result = await customerService.createAddress(req.body , userId as string);
    // console.log(result);

    res.status(200).json(result);
  } catch (error : any) {
    res.status(500).json({
      success : false,
      message : error.message
    })
  }
}

const getMyAddress = async(req: Request, res : Response) => {
  try {
    console.log('hi');

    if(!req.user){
      return res.status(404).json({
        success : false,
        message : "You are not Authorized"
      })
    }
    // console.log(req.body);

    const userId = req.user.id as string ;
    const result = await customerService.getMyAddress(userId as string);
    // console.log(result);

    res.status(200).json(result);
  } catch (error : any) {
    res.status(500).json({
      success : false,
      message : error.message
    })
  }
}

const createReview = async(req: Request, res : Response) => {
  try {

    if(!req.user){
      return res.status(404).json({
        success : false,
        message : "You are not Authorized"
      })
    }

    const userId = req.user.id as string ;
    const result = await customerService.createReview(req.body , userId as string);

    res.status(200).json(result);
  } catch (error : any) {
    res.status(500).json({
      success : false,
      message : error.message
    })
  }
}

const getReview = async(req: Request, res : Response) => {
  try {

    if(!req.user){
      return res.status(404).json({
        success : false,
        message : "You are not Authorized"
      })
    }

    const userId = req.user.id as string ;
    const result = await customerService.getReview(userId as string);

    res.status(200).json(result);
  } catch (error : any) {
    res.status(500).json({
      success : false,
      message : error.message
    })
  }
}

const getSingleMedicineReview = async(req: Request, res : Response) => {
  try {

    if(!req.user){
      return res.status(404).json({
        success : false,
        message : "You are not Authorized"
      })
    }

    const {medicineId} = req.params ;
    console.log(medicineId);
    const result = await customerService.getSingleMedicineReview(medicineId as string);

    res.status(200).json(result);
  } catch (error : any) {
    res.status(500).json({
      success : false,
      message : error.message
    })
  }
}

export const customerController = {
  getMyProfile, getMyOrder, editMyProfile, getSingleOrder, addShippingAddress, AddItemToCard,getMyCartItem, getMySingleCartItem, DecrementCartItem, deleteCartItem, createAddress, getMyAddress, createReview, getReview, getSingleMedicineReview
}