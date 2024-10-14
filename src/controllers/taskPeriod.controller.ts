import { TaskPeriod } from '@prisma/client';
import { Request, Response } from "express";
import { LifeStageCalc } from "src/calculation/lifeStage.calculation";
import { TaskPeriodService } from "src/services/TaskPeriod.service";
import { CurrentAgeEnum } from 'src/types/currentAge.enum';
import { DurationPeriods, LifeStageSeasons, TaskPeriodFind } from "src/types/lifeStageSeasons";
import { number } from 'zod';


export class TaskPeriodController {
     
    taskPeriodService  = new TaskPeriodService();
    lifeStageCalc = new LifeStageCalc();

    // добавление новых задач периодов
    add = async (req: Request, res: Response) => { 

        const tasks: TaskPeriod[] = req.body;
        if(!tasks)
            return res.status(400).json({ message: "Ошибка! Вы передали пустой массив"})

        tasks.forEach(async (task) => {
            await this.taskPeriodService.create(task)  
        })

        return res.status(200).json({ message: `Успех! В БД добавлено задач периода: ${tasks.length}`})
    }

    getTaskPeriodByDate = async (req: Request, res: Response) => { 

        let taskPeriodText =  new LifeStageSeasons();
        let taskPeriodFind = new TaskPeriodFind();
        
        if(!req.query.date)
            return res.status(404).json({ message: "Ошибка! Некоректно передана параметр date в строке запроса" })

        let [ year, month, day ] = String(req.query.date)
                        .split('T')[0]
                        .split('-')
                        .map(s => Number(s));

        let dateCalc = new Date(year, month-1, day+1); 
        if(!dateCalc)
             res.status(404).json({ message: "Ошибка! Некоректно передана параметр date в строке запроса" })

        let  destinyNumber                   = this.lifeStageCalc.destinyNumber(dateCalc);                      // Число судьбы
        let  soulNumber                      = this.lifeStageCalc.soulNumber(dateCalc);                         // число души
        let  durationPeriod: DurationPeriods = this.lifeStageCalc.durationPeriods(dateCalc, destinyNumber);     //  Продолжительность периодов
        let  currentAge                      = this.lifeStageCalc.currentAgeNum(dateCalc)                       // Текущий возраст
        let  taskPeriod: LifeStageSeasons    = this.lifeStageCalc.calcTaskPeriod(dateCalc);                     // Задача периода
        let quantity1InCharacterField        = this.lifeStageCalc.numberUnits(dateCalc);                        // Количество единиц

        if(!this.taskPeriodService) {
            console.log('null');
        }
            

        taskPeriodFind = (await this.taskPeriodService.findTask(1, 
                                                                this.lifeStageCalc.currentAge(durationPeriod.springEnd, currentAge),
                                                                soulNumber,
                                                                destinyNumber,
                                                                quantity1InCharacterField,
                                                                <number>taskPeriod.spring));
        if(taskPeriodFind)
            ({ task: taskPeriodText.spring, strategicGoal: taskPeriodText.springGoal } = taskPeriodFind); 
        

        taskPeriodFind = (await this.taskPeriodService.findTask(2, 
                                                                this.lifeStageCalc.currentAge(durationPeriod.summerEnd, currentAge),
                                                                soulNumber,
                                                                destinyNumber,
                                                                quantity1InCharacterField,
                                                                <number>taskPeriod.summer));
        if(taskPeriodFind)
            ({ task: taskPeriodText.summer, strategicGoal: taskPeriodText.summerGoal } = taskPeriodFind);
        
        

        taskPeriodFind = (await this.taskPeriodService.findTask(3, 
                                                                this.lifeStageCalc.currentAge(durationPeriod.autumnEnd, currentAge),
                                                                soulNumber,
                                                                destinyNumber,
                                                                quantity1InCharacterField,
                                                                <number>taskPeriod.autumn));
        if(taskPeriodFind)
            ({ task: taskPeriodText.autumn, strategicGoal: taskPeriodText.autumnGoal } = taskPeriodFind); 


        taskPeriodFind = (await this.taskPeriodService.findTask(4, 
                                                                this.lifeStageCalc.currentAge(durationPeriod.winterEnd, currentAge),
                                                                soulNumber,
                                                                destinyNumber,
                                                                quantity1InCharacterField,
                                                                <number>taskPeriod.winter));
        if(taskPeriodFind)
            ({ task: taskPeriodText.winter, strategicGoal: taskPeriodText.winterGoal } = taskPeriodFind); 


        return res.status(200).json(taskPeriodText); 
    }

}