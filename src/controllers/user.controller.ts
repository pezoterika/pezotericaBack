import { IPayload } from 'src/types/payload.interface';
import dotenv from 'dotenv'; 
import { UserService } from '../services/user.Service';
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Role } from '@prisma/client';
import bcrypt  from 'bcrypt';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import { string } from 'zod';

export class UserController {

    userService = new UserService();
    filePathAvatar = process.env.UPLOAD_AVATAR_FOLDER + '/upload/';
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
                role:        Role.ADMIN, 
                img:         ''
            },
            {
                id:          2,
                firstName:   "Дарья",
                lastName:    "Кондрашова", 
                email:       "kondrashova_dasha@mail.ru",
                password:     bcrypt.hashSync("ezude8up", 8), 
                dateOfBirth: new Date(),
                role:        Role.ADMIN,
                img:         ''
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
                                            dateOfBirth: user.dateOfBirth,
                                            img: user.img
                                        })
        else  return res.status(404)   
    }


    uploadAvatar = async (req: Request, res: Response) => {

        let { email } = res.locals.payload; // получаю email из middleware
        let image  = req.files.image as fileUpload.UploadedFile; 

        if(!image) return res.status(400).json({ message: "Ошибка! Не найден файл" })
        
        image.mv(process.env.UPLOAD_AVATAR_FOLDER + '/upload/' + email); 
        return res.status(200)
    }


    updProfileInfo = async (req: Request, res: Response) => {
        let { firstName, lastName, dateOfBirth} = req.body; 
        const { email } = res.locals.payload; // получаю email из middleware
        console.log(req.body);
        let image  = req.files?.image as fileUpload.UploadedFile;
        
        let nameFile = image 
                        ? (<string>email).replace('.ru', '') + image.name.substring(image.name.lastIndexOf('.'))
                        : '';
  
        if(image) {
            if(fs.existsSync(this.filePathAvatar + nameFile)) {
                    
                fs.unlink(this.filePathAvatar + nameFile, (err) => {
                    if (err) {
                        console.error('Ошибка удаления файла:', err);
                        return;
                    }
                });
                image.mv(process.env.UPLOAD_AVATAR_FOLDER + '/upload/' + nameFile); 
            }
            else image.mv(process.env.UPLOAD_AVATAR_FOLDER + '/upload/' + nameFile);  
        }
        
        const updUser = await this.userService.findByEmail(email);
        if(updUser) {
             updUser.firstName = firstName;
             updUser.lastName = lastName;
             updUser.img = Buffer.from(fs.readFileSync(process.env.UPLOAD_AVATAR_FOLDER + '/upload/' + nameFile)).toString("base64");
            //  updUser.img = req.files.image.toString('base64')
             console.log( updUser.img)
             updUser.dateOfBirth = dateOfBirth;
             await this.userService.update(updUser);
        }

        return res.status(200); 
    }


}