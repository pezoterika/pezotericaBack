import { ForecastDay, PrismaClient } from "@prisma/client";

export class ForecastDayService {

    prisma = new PrismaClient;

    async create(_forecastDay: ForecastDay) : Promise<ForecastDay> {
        return this.prisma.forecastDay.create({
            data: _forecastDay
        })
    }

    
    async findById(_id: number) : Promise<ForecastDay> {
        return this.prisma.forecastDay.findUnique({
            where: {
                id: _id
            }
        })
    }
    
}