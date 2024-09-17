import { PrismaClient, RefreshToken } from "@prisma/client";
import * as AuthConfig from 'src/config/auth.config';
import { v4 as uuidv4 } from "uuid";
import { UserService } from './user.Service';

export class RefreshTokenService {

    prisma = new PrismaClient;
    userService = new UserService;  

    async create(_userId: number) : Promise<RefreshToken> {
       let expiredAt = new Date();
       expiredAt.setSeconds(expiredAt.getSeconds() + AuthConfig.JWT_REFRESH_EXPIRATION);
       let token = uuidv4();
       return this.prisma.refreshToken.create({
            data: {
                refreshToken: token,
                userId:       _userId,
                expiredAt:    expiredAt
            }
        })
    }

    async findByRefToken(_token: string) : Promise<RefreshToken> {
        return this.prisma.refreshToken.findFirst({
             where: {
                 refreshToken: _token,
             }
         })
    }


    async findByUserId(_userId: number) : Promise<RefreshToken> {
        return this.prisma.refreshToken.findFirst({
             where: {
                 userId: _userId,
             }
         })
    }

    async deleteByUserId(_userId: number) : Promise<RefreshToken> {
        return this.prisma.refreshToken.delete({
             where: {
                 userId: _userId,
             }
         })
    }



    async deleteById(_id: number) : Promise<RefreshToken> {
        return this.prisma.refreshToken.delete({
             where: {
                 id: _id,
             }
         })
    }

    async existByEmail(_email: string) : Promise<boolean> {
        const user = await this.userService.findByEmail(_email)
        if(!user) return false;
        
        const refToken = await this.findByUserId(user.id);
        if(!refToken) return false;

        return true;
    }

    async findByEmail(_email: string) : Promise<RefreshToken> {
        const user = await this.userService.findByEmail(_email)
        return this.prisma.refreshToken.findFirst({
            where: {
                userId: user.id,
            }
        })
    }


    async deleteByEmail(_email: string) : Promise<RefreshToken> {
        const user = await this.userService.findByEmail(_email);
        return this.prisma.refreshToken.delete({
            where: {
                userId: user.id,
            }
        })
    }

}