import { News, PrismaClient } from "@prisma/client";

export class NewsServices {
    
    prisma = new PrismaClient;

    async create(_news: News) {
        return this.prisma.news.create({
            data: _news
        })
    }

    async getPage(_skip: number, _take: number){
        return this.prisma.news.findMany({
            skip: _skip,
            take: _take,
            orderBy: {
                datePosted: 'desc'
            }
        })
    }
}