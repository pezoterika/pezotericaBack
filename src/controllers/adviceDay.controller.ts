import { Request, Response } from "express";
import { AdviceDayService } from '../services/AdviceDay.service';
import { AdviceDay } from "@prisma/client";
import { number } from "zod";


export class AdviceDayController {
     
    adviceDayService  = new AdviceDayService();


    // добавление новых советов
    add = async (req: Request, res: Response) => { 

        const advices: AdviceDay[] = req.body;
        if(!advices)
            return res.status(400).json({ message: "Ошибка! Вы передали пустой массив"})

        advices.forEach(async (advice) => {
            await this.adviceDayService.create(advice); 
        })

        return res.status(200).json({ message: `Успех! В БД добавлено советов дня: ${advices.length}`})
    }

     // Получение совета для расчитанного числа
    getAdvice = async (req: Request, res: Response) => { 

        let id: number = parseInt(req.params.id);
        if(!id || id <= 0)
            return res.status(400).json({ message: `Ошибка! Некорректно задан параметр id`})
        
        const advice = await this.adviceDayService.findById(id);
        if(!advice) 
            return res.status(404).json({ message: `Нет записей`})

        return res.status(200).json(advice)
    }
}
