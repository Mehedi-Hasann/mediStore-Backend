
import { NextFunction, Request, Response } from "express"
import {auth as betterAuth} from "../lib/auth";
import { UserRole } from "../constants/enum";

declare global {
  namespace Express {
    interface Request {
      user ?: {
        id : string;
        name : string;
        email : string;
        role : string;
        emailVerified : boolean;
      }
    }
  }
}



export const auth = (...roles : any) => {
  return async(req: Request, res: Response, next: NextFunction) => {
    // console.log("Expected role => ",roles);

    const session = await betterAuth.api.getSession({
      headers : req.headers as any
    });
    // console.log({session : session?.user.role});

    if(!session){
      return res.status(401).json({
        success : false,
        message : "You are not Authorized!"
      })
    }

    if(!session.user.emailVerified){
      return res.status(403).json({
        success : false,
        message : "Your Email is not Verified. Please Verify your email."
      })
    }
    req.user = {
      id : session.user.id,
      name : session.user.name,
      email : session.user.email,
      role : session.user.role as string,
      emailVerified : session.user.emailVerified
    }
    // console.log("Requested role => ",req.user.role);
    // console.log(roles.includes(req.user.role as UserRole));

    if(roles.length && !roles.includes(req.user.role as UserRole)){
      return res.status(403).json({
        success : false,
        message : "Forbidden. You don't have permission to this resources."
      })
    }
    // console.log(roles.length);

    // console.log("ok");
    next()
  }
}