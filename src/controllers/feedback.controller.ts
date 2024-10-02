import { Request, Response } from "express";
import { Feedback } from "src/types/feedback.interface";
import { FeedBackService } from '../services/feedback.service';

export class FeedbackController {

    feedBackService = new FeedBackService(); 

    forward = async(req: Request, res: Response) => { 

        const feedback: Feedback = req.body; 

        await this.feedBackService.forwardLetter(feedback); 
        console.log(feedback)
        return res.status(200).json({ message: `Успех! Соощение отрпавлено в службу поддержки`})
    }
}