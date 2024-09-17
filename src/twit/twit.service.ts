// import { PrismaClient, Twit } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { ICreateTwit } from "./types/twit.types";


export class TwitService {

    prisma = new PrismaClient();;
/*
    async createTwit(twit: ICreateTwit) : Promise<Twit> {
        return this.prisma.twit.create({
            data: twit
        });
    }
        */
}