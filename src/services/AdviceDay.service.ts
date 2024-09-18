import { AdviceDay, PrismaClient } from "@prisma/client";

export class AdviceDayService {

    prisma = new PrismaClient;

    async create(_adviceDay: AdviceDay) : Promise<AdviceDay> {
        return this.prisma.adviceDay.create({
            data: _adviceDay
        })
    }
    
}