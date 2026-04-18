import { Rating } from "../../generated/enums"

export interface IUpdateAddress{
  fullName : string,
  phone : string,
  city : string,
  area ?: string,
  street ?: string,
  houseNo ?: string,
  postalCode ?: string
}

export interface IReview{
  medicineId : string,
  rating ?: Rating,
  description : string,
}