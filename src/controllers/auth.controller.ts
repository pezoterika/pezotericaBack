import { Request, Response, Router } from "express";
import { UserService } from "src/services/user.Service";
import bcrypt  from 'bcrypt';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import * as AuthConfig from 'src/config/auth.config';
import { RefreshTokenService } from '../services/refreshToken.service';
import { IPayload } from "src/types/payload.interface";
import { EmailService } from '../services/email.service';
import { User } from "@prisma/client";


export class AuthController{

    userService = new UserService();
    refreshTokenService = new RefreshTokenService(); 
    emailService = new EmailService();

    // Проверка существует ли пользователь
    userIsExist = async (req: Request, res: Response) => { 

        let email = <string>req.query.email;
        if(!email)
           return res.status(400).json({ message: "Ошибка! Не указан параметр строки запроса." })

        const user = await this.userService.findByEmail(email);

        if(user)
            return res.status(200).json(true)
        else  return res.status(404).json(false) 
    }
 
   
    // регистрация
    register = async (req: Request, res: Response) => { 

        if(await this.userService.isExists(req.body)){
            return res.status(409).json({ message: "Пользователь уже существует" });
        }
        req.body.password = bcrypt.hashSync(req.body.password, 8);
        const user = await this.userService.create(req.body); 

        if(user) {
            let payload = { email: user.email, role: user.role };
            const token = jwt.sign(payload, AuthConfig.SECRET_KEY, { expiresIn: AuthConfig.JWT_EXPIRATION })
            const refreshToken = await this.refreshTokenService.create(user.id);

            return res.status(201).json({ token: token, refreshToken:  refreshToken.refreshToken});
        } 
    }

    // Вход
    login = async(req: Request, res: Response) => {

        const user = await this.userService.findByEmail(req.body.email);

        // console.log(`${user.password}`)
        // console.log(`${req.body.password}`)

        if(user){
            const isValidPass = await bcrypt.compare(req.body.password, user.password);
            if(!isValidPass) 
                return res.status(401).send({ message: "Incorrect login or password"});
            
            let payload = { email: user.email, role: user.role };
            const token = jwt.sign(payload, AuthConfig.SECRET_KEY, { expiresIn: AuthConfig.JWT_EXPIRATION }); 
            
            
            if(await this.refreshTokenService.existByEmail(user.email) ){
                await this.refreshTokenService.deleteByEmail(user.email); 
            }

            const refreshToken = await this.refreshTokenService.create(user.id);

            res.status(200).header("auth-token", token).send({ token: token, refreshToken: refreshToken.refreshToken });
        }
        else res.status(401).send({ message: "Incorrect login or password"}) 
    }

    // запрос на изменение токена через refresh token
    refreshToken = async(req: Request, res: Response) => {

        const refToken = await this.refreshTokenService.findByRefToken(req.body.refreshToken);
        const user = await this.userService.findById(refToken.userId);

        if(!user)
            return res.status(401).json({ message: "Ошибка! Для токена обновления не найден пользователь" });

        await this.refreshTokenService.deleteById(refToken.id);

        let payload = { email: user.email, role: user.role };
        const token = jwt.sign(payload, AuthConfig.SECRET_KEY, { expiresIn: AuthConfig.JWT_EXPIRATION })
        const refreshToken = await this.refreshTokenService.create(user.id);

        return res.status(201).json({ token: token, refreshToken:  refreshToken.refreshToken});
    }

    // Выход
    logout = async(req: Request, res: Response) => {
        
        let token = req.headers.authorization.split(' ')[1];
        let { email } = <IPayload>jwt.decode(token)

        await this.refreshTokenService.deleteByEmail(email); 
        return res.status(200).json({ message: "Выход из учетной записи выполнен успешно" });  
    }


    // забыл пароль
    forgot = async(req: Request, res: Response) => {
        
        let { email } = req.body;
        if(!email)
            return res.status(400).json({ message: "Ошибка! Некорректно отправлен запрос" });

        const user = await this.userService.findByEmail(email)
        console.log(user)
        if(!user){
            return res.status(400).json({ message: "Ошибка! Некорректно отправлен запрос" });
           
        }

        if(await this.refreshTokenService.existByEmail(user.email) ){
            await this.refreshTokenService.deleteByEmail(user.email); 
        }

        const token = jwt.sign({ email: user.email }, AuthConfig.SECRET_KEY_FORGOT, { expiresIn: AuthConfig.JWT_FORGOT_EXPIRATION })

        await this.emailService.sendEmailForgot(user, token);
        return res.status(200).json({ message: "Успех! ссылка для сброса пароля направлена на почту" });  
    }


    // сброс пароля
    reset = async(req: Request, res: Response) => {  

        let { tokenForgot, password } = req.body;
        
        let { email } = <IPayload>jwt.decode(tokenForgot);
        let user: User = await this.userService.findByEmail(email);   
        
        if(!user)
            return res.status(404).json({ message: "Ошибка! Пользователь не найден" });

        let payload = { email: user.email, role: user.role };
        const token = jwt.sign(payload, AuthConfig.SECRET_KEY, { expiresIn: AuthConfig.JWT_EXPIRATION })
        const refreshToken = await this.refreshTokenService.create(user.id);

        await this.userService.updatePassword(email, bcrypt.hashSync(password, 8));

        return res.status(201).json({ token: token, refreshToken:  refreshToken.refreshToken});
    }

    // индефикация пользователя который забыл пароль
    checkForgot = async(req: Request, res: Response) => {
        
        let errorMessage = '';
        let { key } = req.query;
    
        if(!key || key === null)
            return res.status(400).json({ message: "Ошибка! Некоррекный запрос" });

        jwt.verify(<string>key, AuthConfig.SECRET_KEY_FORGOT, (err: any, decoded: any) => {
            if(err instanceof JsonWebTokenError)
                errorMessage = 'Ошибка! Недействительный токен'
            
            if(err instanceof TokenExpiredError) 
                errorMessage = 'Ошибка! Срок действия ключа для сброса пароля истек'
        });
        if(errorMessage) 
            return res.status(403).json({ message: errorMessage})


        return res.status(200).json({ message: "Успех!" });
    }
}
