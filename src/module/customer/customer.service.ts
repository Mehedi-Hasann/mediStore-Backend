import { Address, Review, User } from "../../generated/client";
import { prisma } from "../../lib/prisma"
import { EditUser } from "../../types/type";

const getMyProfile = async (id : string) => {
  
  const res = await prisma.user.findUniqueOrThrow({
    where : {
      id
    }
  })
  
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

const addShippingAddress = async (payload : {city : string}, userId : string) => {
  const user = await prisma.address.update({
    where : {
      userId
    },
    data : {
      city : payload.city
    }
  })
  console.log(user);

  return user;
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
  console.log(res);

  return res;
}

const getMyCartItem = async (userId : string) => {

  const cartItem = await prisma.cart.findMany({
    where : {
      userId
    }
  })
  return cartItem;
}

const getMySingleCartItem = async (id : string) => {

  const cartItem = await prisma.cart.findUnique({
    where : {
      id
    }
  })
  console.log(cartItem);
  return cartItem;
}

const DecrementCartItem = async(payload : {medicineId : string}, userId : string) => {
  console.log(payload);
  const checkItem = await prisma.cart.findUnique({
        where : {
          userId_medicineId : {
            userId,
            medicineId : payload.medicineId
          }
        }
  })
  console.log(checkItem);
  if(checkItem?.quantity === 0 || checkItem?.quantity === null){
    throw new Error ("Quantity Cannot be Negative")
  }

  const res = await prisma.cart.upsert({
    where : {
      userId_medicineId : {
        userId,
        medicineId : payload.medicineId
      }
    },
    update : {
      quantity : {
        decrement : 1
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

const deleteCartItem = async(id : string) => {
  // console.log(payload);
  const res = await prisma.cart.delete({
    where : {
      id
    }
  })
  console.log(res);

  return res;
}

const createAddress = async (payload : Address, userId : string) => {
  console.log(payload);
  const res = await prisma.address.upsert({
    where : {
      userId
    },
    update : {
      ...payload,
      userId
    },
    create : {
      ...payload,
      userId
    }
  })
  console.log(res);
  return res;
}

const getMyAddress = async (userId : string) => {
  console.log(userId);
  const res = await prisma.address.findUniqueOrThrow({
    where : {
      userId
    }
  })
  console.log(res);
  return res;
}

const createReview = async (payload : Omit<Review, "userId">, userId : string) => {
  console.log(payload);
  const res = await prisma.review.create({
    data : {
      ...payload,
      userId
    }
  })
  console.log(res);
  return res;
}

const getReview = async (userId : string) => {

  const res = await prisma.review.findMany({
    where : {
      userId
    }
  })
  console.log(res);
  return res;
}

const getSingleMedicineReview = async (medicineId : string) => {

  const res = await prisma.review.findMany({
    where : {
      medicineId
    }
  })
  // console.log(res);
  return res;
}

export const customerService = {
  getMyProfile,getMyOrder,editMyProfile, getSingleOrder, addShippingAddress, AddItemToCard, getMyCartItem, getMySingleCartItem, DecrementCartItem,deleteCartItem, createAddress, getMyAddress, createReview, getReview, getSingleMedicineReview
}