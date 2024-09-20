import { LessonPeriod } from '@prisma/client';
import { LessonPeriodService } from '../services/LessonPeriod.service';
import { Request, Response } from "express";
export class LessonPeriodController {

    lessonPeriodService = new LessonPeriodService(); 

    // добавление урока периода
    add = async (req: Request, res: Response) => { 

        const lessons: LessonPeriod[] = req.body;
        if(!lessons)
            return res.status(400).json({ message: "Ошибка! Вы передали пустой массив"})

        lessons.forEach(async (lesson) => {
            await this.lessonPeriodService.create(lesson) 
        })

        return res.status(200).json({ message: `Успех! В БД добавлено советов дня: ${lessons.length}`})
    }
}