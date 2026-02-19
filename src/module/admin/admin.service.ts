import { User } from "../../generated/client";
import { prisma } from "../../lib/prisma"

const getAllUser = async(page : number, limit: number) => {
  const data = await prisma.user.findMany({
    take : limit,
    skip : (page-1)*limit
  });

  const totalUser = await prisma.user.count();
  // console.log(totalUser);

  return {data,page, limit, totalUser, totalPage : Math.ceil(totalUser/limit)};
}

const updateUserStatus = async(payload : Pick<User, "userStatus">,id : string) => {
  // console.log(id);
  await prisma.user.findUniqueOrThrow({
    where : {
      id
    }
  })

  const result = await prisma.user.update({
    where : {
      id
    },
    data : {
      userStatus : payload.userStatus
    }
  })

  return result;
}

export const adminService = {
  getAllUser, updateUserStatus
}