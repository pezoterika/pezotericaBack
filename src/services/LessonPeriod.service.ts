import { LessonPeriod, PrismaClient } from "@prisma/client";

export class LessonPeriodService {

    prisma = new PrismaClient;

    async create(_lessonPeriod: LessonPeriod) : Promise<LessonPeriod> {
        return this.prisma.lessonPeriod.create({
            data: _lessonPeriod
        })
    }
}