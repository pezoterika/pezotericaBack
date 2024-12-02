import { Request, Response } from "express";
import { ForecastDayService } from '../services/ForecastDay.service';
import { ForecastDay } from "@prisma/client";

export class ForecastDayController {

    ForecastDayService  = new ForecastDayService();

    //добавление прогноза на день
    add = async (req: Request, res: Response) => { 

        const forecastsDay: ForecastDay[] = req.body;
        if(!forecastsDay)
            return res.status(400).json({ message: "Ошибка! Вы передали пустой массив"})

        forecastsDay.forEach(async (forecastsDay) => {
            await this.ForecastDayService.create(forecastsDay);  
        })

        return res.status(200).json({ message: `Успех! В БД добавлено прогнозов дня: ${forecastsDay.length}`})
    }


}