import { Request, Response } from "express";
import { Category } from "../../generated/client";
import { prisma } from "../../lib/prisma";

const createCategory = async(data : Omit<Category, "id">) => {
  const result = await prisma.category.create({
    data
  })

  return result;
}

const getSingleCategory = async(categoryId : string) => {
  const result = await prisma.category.findUnique({
    where : {
      id : categoryId
    },
    include : {
      medicines : {
        select : {
          name : true,
          price : true
        }
      }
    }
  })
  // console.log(result);

  return result;

}
const getAllCategory = async() => {
  const result = await prisma.category.findMany();
  return result;
}


export const categoryService = {
  createCategory, getSingleCategory, getAllCategory
}
