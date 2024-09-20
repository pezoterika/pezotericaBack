import { Request, Response } from "express";
import { AdviceDayService } from '../services/AdviceDay.service';
import { AdviceDay } from "@prisma/client";
import { date, number } from "zod";
import { AdviceDayCalc } from '../calculation/adviceDay.calculation';


export class AdviceDayController {
     
    adviceDayService  = new AdviceDayService();
    adviceDayCalc = new AdviceDayCalc();

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
    getAdviceById = async (req: Request, res: Response) => { 

        let id: number = parseInt(req.params.id);
        if(!id || id <= 0)
            return res.status(400).json({ message: `Ошибка! Некорректно задан параметр id`})
        
        const advice = await this.adviceDayService.findById(id);
        if(!advice) 
            return res.status(404).json({ message: `Нет записей`})

        return res.status(200).json(advice)
    }
    
    // Получение совета по дате
    getAdviceByDate = async (req: Request, res: Response) => { 
    
        let [ year, month, day ] = String(req.query.date)
                        .split('T')[0]
                        .split('-')
                        .map(s => Number(s));

        let dateCalc = new Date(year, month-1, day+1);
        if(!dateCalc)
            res.status(404).json({ message: "Ошибка! Некоректно передана параметр date в строке запроса" })
        
        let adviceId = this.adviceDayCalc.calcNumberByDate(dateCalc);
        const advice = await this.adviceDayService.findById(adviceId);
         
        if(!advice)
            return res.status(404).json({ message: "Ошибка! Не найдено" });

        return res.status(200).json({ advice: advice.advice});  
    }
    
}
