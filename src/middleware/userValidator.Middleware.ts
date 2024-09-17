import { NextFunction, Request, Response } from "express";
import { userCreateValidator, userLoginValidator } from "src/validators/user.validator";


export const userCreateFieldValidator = async (req: Request, res:Response, next: NextFunction) => {
    
    const validation = userCreateValidator.safeParse(req.body);
    if(!validation.success){
        return res.status(400).json( { message : validation.error })
    }

    next();
}

export const userLoginFieldValidator = async (req: Request, res:Response, next: NextFunction) => {
    
    const validation = userLoginValidator.safeParse(req.body);
    if(!validation.success){
        return res.status(400).json( { message : validation.error })
    }

    next();
}