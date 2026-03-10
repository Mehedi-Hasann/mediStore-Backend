
import { Order, OrderStatus } from "../../generated/client";
import { prisma } from "../../lib/prisma";

const createOrder = async(payload : Order, userId : string) => {
  // console.log('order create - > ', payload);

    const medicineExists = await prisma.medicine.findUnique({
        where : {
          id : payload.medicineId
        }
    });

  if (!medicineExists) {
    throw new Error("Medicine is not Found! Try again later");
  }
  if(medicineExists?.stock < payload.quantity) {
      throw new Error("Insufficient medicine stock!");
  }

  const medicine = await prisma.medicine.update({
    where : {
      id : payload.medicineId
    },
    data : {
      stock : {
        decrement : payload.quantity
      }
    }
  });

  const result = await prisma.order.create({
    data : {
      userId,
      medicineId : payload.medicineId,
      status : OrderStatus.PENDING,
      quantity : payload.quantity,
      totalAmount : (medicine?.price ?? 0) * payload.quantity,
      addressId : payload.addressId
    }
  })
  // console.log({result});

  return result;
}

const getAllOrder = async(id : string, page : number, limit : number) => {
  // console.log({id, page, limit});
  console.log(id);
  const data = await prisma.order.findMany({
    take : limit,
    skip : (page-1)*limit,
    where : {
      userId : id
    }
  });
  const total = await prisma.order.count({
    where : {
      userId : id
    }
  });
  console.log(data);

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