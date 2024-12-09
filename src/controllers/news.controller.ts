import { News } from "@prisma/client";
import { Request, Response } from "express";
import { NewsServices } from "src/services/news.service";


export class NewsController {

    newsService = new NewsServices();

    add = async (req: Request, res: Response) => { 

        const newsList: News[] = req.body;
        if(!newsList)
            return res.status(400).json({ message: "Ошибка! Вы передали пустой массив"})

        newsList.forEach(async (news) => {
            await this.newsService.create(news) 
        })

        return res.status(200).json({ message: `Успех! В БД добавлено новостей: ${newsList.length}`}) 
    }

    getPage = async (req: Request, res: Response) => { 
        
        let take = +req.query.take;
        let skip = +req.query.skip;

        console.log(`take = ${take} skip = ${skip}`)

        if((isNaN(take) || !take) || isNaN(skip))
            return res.status(404).json({ message: "Ошибка! Некоректно передана параметры" })

        const newsList = await this.newsService.getPage(skip, take); 
        return res.status(200).json(newsList)  
    }
}