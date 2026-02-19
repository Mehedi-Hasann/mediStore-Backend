
import { Order, OrderStatus } from "../../generated/client";
import { prisma } from "../../lib/prisma";

const createOrder = async(payload : Order, userId : string) => {
  console.log(payload.id);


  const medicine = await prisma.medicine.findUnique({
    where : {
      id : payload.id
    }
  });
  // console.log(medicine);

  if(!medicine){
    throw new Error("Medicine is not Found! Try again later");
  }
 
  const result = await prisma.order.create({
    data : {
      medicineId : medicine?.id,
      status : OrderStatus.PENDING,
      totalAmount : (medicine?.price ?? 0) * payload.quantity,
      userId,
      quantity : payload.quantity
    }
  })

  // console.log(medicine);

  return result;
}

const getAllOrder = async(id : string, page : number, limit : number) => {
  // console.log({id, page, limit});
  const data = await prisma.order.findMany({
    take : limit,
    skip : (page-1)*limit,
    where : {
      userId : id
    }
  });
  const total = await prisma.order.count();

  return {data, total, page , limit , totalPage : Math.ceil(total/limit)};
}

const getSingleOrder = async(id : string) => {
  // console.log(id);
  const result = await prisma.order.findMany({
    where : {
      id
    }
  })
  // console.log(result);

  return result;
}

export const orderService ={
  createOrder, getAllOrder, getSingleOrder
}