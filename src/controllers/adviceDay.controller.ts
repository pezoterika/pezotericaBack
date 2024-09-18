import { Request, Response } from "express";
import { AdviceDayService } from '../services/AdviceDay.service';
import { AdviceDay } from "@prisma/client";


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

}
