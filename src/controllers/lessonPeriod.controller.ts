import { LessonPeriod } from '@prisma/client';
import { LessonPeriodService } from '../services/LessonPeriod.service';
import { Request, Response } from "express";
import { LifeStageSeasons } from 'src/types/lifeStageSeasons';
import { LifeStageCalc } from '../calculation/lifeStage.calculation';
export class LessonPeriodController {

    lessonPeriodService = new LessonPeriodService();
    lifeStageCalc = new LifeStageCalc();

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

    getLessonsByDate = async (req: Request, res: Response) => { 
    
        let lessonsPeriod = new LifeStageSeasons();
        let lessonsPeriodNum = new LifeStageSeasons();

        let [ year, month, day ] = String(req.query.date)
                        .split('T')[0]
                        .split('-')
                        .map(s => Number(s));

        let dateCalc = new Date(year, month-1, day+1);
        if(!dateCalc)
            res.status(404).json({ message: "Ошибка! Некоректно передана параметр date в строке запроса" })
        
        lessonsPeriodNum = this.lifeStageCalc.calcLessonPeriod(dateCalc);
        
        lessonsPeriod.autumn = (await this.lessonPeriodService.findByLessonPeriod(<number>lessonsPeriodNum.autumn)).lesson
        lessonsPeriod.summer = (await this.lessonPeriodService.findByLessonPeriod(<number>lessonsPeriodNum.summer)).lesson
        lessonsPeriod.winter = (await this.lessonPeriodService.findByLessonPeriod(<number>lessonsPeriodNum.winter)).lesson
        lessonsPeriod.spring = (await this.lessonPeriodService.findByLessonPeriod(<number>lessonsPeriodNum.spring)).lesson

        return res.status(200).json(lessonsPeriod);  
    }
}