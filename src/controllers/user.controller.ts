import { IPayload } from 'src/types/payload.interface';
import { UserService } from '../services/user.Service';
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export class UserController {

    userService = new UserService();

    findByEmail = async (req: Request, res: Response) => {

        // let email = <string>req.query.email; 
        // if(email) {
        //     const user = this.userService.findByEmail(email);
        //     if(user)
        //         res.status(200).json()
        // }
            
    }

    myProfile = async (req: Request, res: Response) => { 
        let token = req.headers.authorization;
        token = token.split(' ')[1] 

        let { email } = <IPayload>jwt.decode(token);
        const user = await this.userService.findByEmail(email);

        if(user)
            return res.status(200).json({
                                            email: user.email,
                                            firstName: user.firstName,
                                            lastName: user.lastName,
                                            dateOfBirth: user.dateOfBirth
                                        })
        else  return res.status(404) 
        
    }

       
}