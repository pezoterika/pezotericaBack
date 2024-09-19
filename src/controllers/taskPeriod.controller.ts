import { TaskPeriod } from "@prisma/client";
import { Request, Response } from "express";
import { TaskPeriodService } from "src/services/TaskPeriod.service";


export class TaskPeriodController {
     
    taskPeriodService  = new TaskPeriodService();


    // добавление новых задач периодов
    add = async (req: Request, res: Response) => { 

        const tasks: TaskPeriod[] = req.body;
        if(!tasks)
            return res.status(400).json({ message: "Ошибка! Вы передали пустой массив"})

        tasks.forEach(async (task) => {
            await this.taskPeriodService.create(task) 
        })

        return res.status(200).json({ message: `Успех! В БД добавлено советов дня: ${tasks.length}`})
    }

}