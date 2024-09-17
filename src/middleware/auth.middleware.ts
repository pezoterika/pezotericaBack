import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import * as AuthConfig from 'src/config/auth.config';
import { RefreshTokenService } from '../services/refreshToken.service';
import { IPayload } from "src/types/payload.interface";
import { UserService } from "src/services/user.Service";

export const verifyUserToken = async (req: Request, res:Response, next: NextFunction) => {

    let errorMessage = ''; 
    let token = req.headers.authorization;
    if(!token) return res.status(401).send({ message: "Ошибка! Досутуп запрещен / Несанкционный запрос" })
       
    token = token.split(' ')[1] // Remove Bearer from string 
    if (token === 'null' || !token) return res.status(401).send('Ошибка! Несанкционный запрос');
    
    jwt.verify(token, AuthConfig.SECRET_KEY, (err: any, decoded: any) => {
        if(err instanceof JsonWebTokenError)
            errorMessage = 'Ошибка! Недействительный токен'
        
        if(err instanceof TokenExpiredError) 
            errorMessage = 'Ошибка! Срок действия токена доступа истек'
    });

    // Проверяю есть ли refreshToken
    const payload = <IPayload>jwt.decode(token);
    let isExistRefToken = await new RefreshTokenService().existByEmail(payload.email);
    if(!isExistRefToken)
        errorMessage = "Ошибка! Токен больше недействителен"

    
    if(errorMessage) 
        return res.status(401).json({ message: errorMessage})

    next();
}

export const verifyUserRefreshToken = async (req: Request, res:Response, next: NextFunction) => {

    if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(req.body.refreshToken))
        return res.status(401).send({ message: "Ошибка! Не верный токен для обновления" })

    const refToken =  await new RefreshTokenService().findByRefToken(req.body.refreshToken);

    if(!refToken) 
        return res.status(401).send({ message: "Ошибка! Не верный токен для обновления" })

    if(refToken.expiredAt.getTime() < new Date().getTime())
        return res.status(401).send({ message: "Ошибка! У токена для обновления истек срок годности" })
    
    next();
}




