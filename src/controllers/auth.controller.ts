import { Request, Response, Router } from "express";
import { UserService } from "src/services/user.Service";
import bcrypt  from 'bcrypt';
import jwt from "jsonwebtoken";
import * as AuthConfig from 'src/config/auth.config';
import { RefreshTokenService } from '../services/refreshToken.service';
import { IPayload } from "src/types/payload.interface";


export class AuthController{

    userService = new UserService();
    refreshTokenService = new RefreshTokenService(); 
   
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
}
