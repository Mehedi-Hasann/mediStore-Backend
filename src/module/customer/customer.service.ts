import { User } from "../../generated/client";
import { prisma } from "../../lib/prisma"
import { EditUser } from "../../types/type";

const getMyProfile = async (id : string) => {
  // console.log(id);
  const res = await prisma.user.findUniqueOrThrow({
    where : {
      id
    }
  })
  // console.log(res);
  return res;
}

const getMyOrder = async (id : string) => {
  // console.log(id);
  const res = await prisma.order.findMany({
    where : {
      userId : id
    }
  })
  console.log(res);
  return res;
}

const editMyProfile = async (payload : EditUser, userId : string) => {
  const res = await prisma.user.update({
    where : {
      id : userId
    },
    data : {
      name : payload.name,
      email : payload.email
    }
  })
  console.log(res);

  return res;
}

const getSingleOrder = async (id : string) => {
  // console.log(id);
  const res = await prisma.order.findUniqueOrThrow({
    where : {
      id
    }
  })
  // console.log(res);
  return res;
}

const addShippingAddress = async (payload : {id: string,shippingAddress : string}, userId : string) => {
  console.log(payload);
  const res = await prisma.order.update({
    where : {
      id : payload.id
    },
    data : {
      shippingAddress : payload.shippingAddress
    }
  })
  console.log(res);

  return res;
}

const AddItemToCard = async(payload : {medicineId : string}, userId : string) => {
  // console.log(payload);
  const res = await prisma.cart.upsert({
    where : {
      userId_medicineId : {
        userId,
        medicineId : payload.medicineId
      }
    },
    update : {
      quantity : {
        increment : 1
      }
    },
    create : {
      userId,
      medicineId : payload.medicineId
    }
  })
  // console.log(res);

  return res;
}

export const customerService = {
  getMyProfile,getMyOrder,editMyProfile, getSingleOrder, addShippingAddress, AddItemToCard
}