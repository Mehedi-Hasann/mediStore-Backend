
import { Medicine } from "../../generated/client";
import { MedicineWhereInput } from "../../generated/models";
import { prisma } from "../../lib/prisma";

const getMedicineById = async(id : string) => {
  const result = await prisma.medicine.findUniqueOrThrow({
    where : {
      id 
    }
  })
  // console.log(result);

  return result;
}

const getAllMedicine = async({search, price, category, page, limit, sortBy, sortOrder}: 
  {search: string | undefined, 
    price: string | undefined, 
    category : string | undefined,
    page : number,
    limit : number,
    sortBy : string | undefined,
    sortOrder : string | undefined
  }) => {

  const skip = (page-1)*limit;
  
  const priceNum : number = Number(price);
  const andConditions : MedicineWhereInput[] = [];

  if(search){
    andConditions.push({
      name : {
        contains : search as string,
        mode : "insensitive"
      }
    })
  }

  if(priceNum){
    andConditions.push({
      price : priceNum
    })
  }

  const result = await prisma.medicine.findMany({
    take : limit,
    skip,
    where : {
      AND : andConditions
    },
    orderBy : sortBy && sortOrder ? {
      [sortBy] : sortOrder
    } : {price : "asc"},
    include : {
      orders : true
    }
  });
  
  const total = await prisma.medicine.count({
    // take : limit,
    // skip,
    where : {
      AND : andConditions
    }
  })
  return {
    data : result,
    pagination : {
      total,
      page,
      limit,
      totalPages : Math.ceil(total/limit)
    }
  };
}

export const medicineService = {
  getMedicineById, getAllMedicine
}