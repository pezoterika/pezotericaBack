import { Feedback } from "src/types/feedback.interface";
import nodemailer from 'nodemailer';

export class FeedBackService {

    async forwardLetter(_letter: Feedback) {

        let transporter = nodemailer.createTransport({
            host: 'smtp.yandex.ru',
            port: 465,
            secure: true,
            auth: {
                user: 'pezoterika', 
                pass: 'ryshdstgtqrmorky',  
            },
        });

        let result = await transporter.sendMail({
            from: 'pezoterika@yandex.ru',
            to: 'pezoterika@yandex.ru',
            subject: `${_letter.title}`,
            text: `${_letter.question}`,
            html:
                `${_letter.question}`,
        });

        console.log(result); 

    } 

}