import { AdviceDay, PrismaClient } from "@prisma/client";

export class AdviceDayService {

    prisma = new PrismaClient;

    async create(_adviceDay: AdviceDay) : Promise<AdviceDay> {
        return this.prisma.adviceDay.create({
            data: _adviceDay
        })
    }

    
    async findById(_id: number) : Promise<AdviceDay> {
        return this.prisma.adviceDay.findUnique({
            where: {
                id: _id
            }
        })
    }
    
}