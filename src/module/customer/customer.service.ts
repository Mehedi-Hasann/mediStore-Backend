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

export const customerService = {
  getMyProfile,getMyOrder,editMyProfile
}