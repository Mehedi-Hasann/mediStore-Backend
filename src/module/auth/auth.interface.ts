export interface IRegisterCustomerPayload {
  name : string;
  email : string;
  password : string;
  image ?: string
}

export interface ILoginUserPayload {
  email : string;
  password : string;
}

export interface IChangePassword{
  currentPassword: string,
  newPassword: string
}