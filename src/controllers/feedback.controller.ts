import { Request, Response } from "express";
import { Feedback } from "src/types/feedback.interface";
import { EmailService } from '../services/email.service';

export class FeedbackController {

    
    emailService = new EmailService(); 

    forward = async(req: Request, res: Response) => { 

        const feedback: Feedback = req.body; 

        await this.emailService.forwardLetter(feedback);
        console.log(feedback)
        return res.status(200).json({ message: `Успех! Сообщение отрпавлено в службу поддержки`})
    }
}