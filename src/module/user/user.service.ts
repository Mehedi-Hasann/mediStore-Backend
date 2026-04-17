import { Role } from "../../generated/enums";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ICreateAdminPayload, ICreateSellerPayload } from "./user.interface";

const createSeller = async( payload : ICreateSellerPayload) => {
  const isExists = await prisma.seller.findUnique({
    where : {
      email : payload.seller.email
    }
  })

  if(isExists){
    throw new Error("Seller with this email already exists");
  }

  const userData = await auth.api.signUpEmail({
    body : {
      email : payload.seller.email,
      password : payload.password,
      role : Role.SELLER,
      name : payload.seller.name,
      needPasswordChange : true
    }
  });

  try {
      const sellerData = await prisma.$transaction( async (tx) => {

        const CreateSellerData = await tx.seller.create({
          data : {
            userId : userData.user.id,
            id : userData.user.id,
            name : payload.seller.name,
            email : payload.seller.email,
            profilePhoto : payload.seller.profilePhoto ?? null,
            contactNumber : payload.seller.contactNumber ?? null
          }
        });

        return CreateSellerData;
      });

      return sellerData;
  } catch (error) {
    console.log(error);
    await prisma.user.delete({
      where : {
        id : userData.user.id
      }
    })
    throw new Error("Failed to create seller");
  }
  
}

const createAdmin = async( payload : ICreateAdminPayload) => {
  const isExists = await prisma.admin.findUnique({
    where : {
      email : payload.admin.email
    }
  })

  if(isExists){
    throw new Error("Admin with this email already exists");
  }

  const userData = await auth.api.signUpEmail({
    body : {
      email : payload.admin.email,
      password : payload.password,
      role : Role.ADMIN,
      name : payload.admin.name,
      needPasswordChange : true
    }
  });

  try {
      const adminData = await prisma.$transaction( async (tx) => {

        const CreateAdminData = await tx.admin.create({
          data : {
            userId : userData.user.id,
            id : userData.user.id,
            name : payload.admin.name,
            email : payload.admin.email,
            profilePhoto : payload.admin.profilePhoto ?? null,
            contactNumber : payload.admin.contactNumber ?? null
          }
        });

        return CreateAdminData;
      });

      return adminData;
  } catch (error) {
    console.log(error);
    await prisma.user.delete({
      where : {
        id : userData.user.id
      }
    })
    throw new Error("Failed to create admin");
  }

}

export const UserService = {
  createSeller,
  createAdmin
}