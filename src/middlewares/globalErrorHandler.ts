import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import status from "http-status";
import z from "zod";
import { handleZodError } from "../errorHelper/handleZodError";
import { TErrorResponse, TErrorSources } from "../interface/error.interface";
import AppError from "../errorHelper/AppError";
import { deleteFileFromCloudinary } from "../config/cloudinary";

export const globalErrorHandler = async(err : any, req: Request, res: Response, next: NextFunction) => {
  if(envVars.NODE_ENV === "development"){
    console.error("Error from global error handler : ", err);
  }

  if(req.file){
    await deleteFileFromCloudinary(req.file.path)
  }

  if(req.files && Array.isArray(req.files) && req.files.length > 0){
    const imageUrls = req.files.map( (file) => file.path);
    await Promise.all(imageUrls.map(url => deleteFileFromCloudinary(url)))
  }

  let errorSources: TErrorSources[] = [];
  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message : string = 'Internal Server Error';
  let stack : string | undefined = undefined;

  if(err instanceof z.ZodError){
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode || status.BAD_REQUEST;
    message  = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  }
  else if(err instanceof AppError){
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path : 'I am from global error handler and I am an instance of AppError',
        message : err.message
      }
    ]
  }
  else if(err instanceof Error){
    statusCode = status.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path : 'I am from global error handler and I am an instance of Error',
        message : err.message
      }
    ]
  }

  const errorResponse: TErrorResponse = {
    success : false,
    message : message,
    errorSources : errorSources,
    stack : envVars.NODE_ENV === "development" ? stack : undefined,
    error : envVars.NODE_ENV === "development" ? err : undefined
  }
  res.status(statusCode).json(errorResponse);
}