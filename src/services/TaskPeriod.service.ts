import { PrismaClient, TaskPeriod } from "@prisma/client";

export class TaskPeriodService {

    prisma = new PrismaClient;

    async create(_taskPeriod: TaskPeriod) : Promise<TaskPeriod> {
        return this.prisma.taskPeriod.create({
            data: _taskPeriod
        })
    }

    async findTask(_period:                     number, 
                   _currentAge:                 string, 
                   _soulNumber:                 number, 
                   _destinyNumber:              number,
                   _quantity1InCharacterField:  number,
                   _taskPeriod:                 number){
                   
        return this.prisma.taskPeriod.findFirst({
            where: {
                period:                     _period,
                currentAge:                 { has: _currentAge },
                soulNumber:                 { has: _soulNumber },
                destinyNumber:              { has: _destinyNumber },
                quantity1InCharacterField:  { has: _quantity1InCharacterField },
                taskPeriod:                 _taskPeriod              
            }
        })


    }

    
}