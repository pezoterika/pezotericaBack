import { UserService } from '../services/user.Service';
import { Request, Response } from "express";

export class UserConstroller {

    userService = new UserService();

    findByEmail = async (req: Request, res: Response) => {

        // let email = <string>req.query.email; 
        // if(email) {
        //     const user = this.userService.findByEmail(email);
        //     if(user)
        //         res.status(200).json()
        // }
            
    }

       
}