import { IPayload } from 'src/types/payload.interface';
import dotenv from 'dotenv'; 
import { UserService } from '../services/user.Service';
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Role } from '@prisma/client';
import bcrypt  from 'bcrypt';
import fileUpload from 'express-fileupload';

export class UserController {

    userService = new UserService();
    //env2 = dotenv.config();
    

    addIsAdminUsers = async () => { 

       
        const usersAdmin = [
            {
                id:         1,
                firstName:   "Даниил",
                lastName:    "Тараторкин", 
                email:       "taratockin@yandex.ru",
                password:    bcrypt.hashSync("1234Qq", 8), 
                dateOfBirth: new Date(),
                role:        Role.ADMIN
            },
            {
                id:          2,
                firstName:   "Дарья",
                lastName:    "Кондрашова", 
                email:       "kondrashova_dasha@mail.ru",
                password:     bcrypt.hashSync("ezude8up", 8), 
                dateOfBirth: new Date(),
                role:        Role.ADMIN
            }
        ]

        usersAdmin.forEach(user => {
            this.userService.create(user);
        })   
    }

    add = async (req: Request, res: Response) => { 
        const user = this.userService.create(req.body);
        if(user)
            return res.status(200).json({ message: "Успех! Пользователь успешно добавлен." })
        else  return res.status(404)   
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


    uploadAvatar = async (req: Request, res: Response) => {

        let image  = req.files.image as fileUpload.UploadedFile;
        if(!image) 
            return res.status(400).json({ message: "Ошибка! Не найден файл" })
        
        image.mv(process.env.UPLOAD_AVATAR_FOLDER + '/upload/' + image.name); 
        return res.status(200)
    }

       
}