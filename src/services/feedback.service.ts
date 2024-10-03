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
            subject: `${_letter.question}`,
            //text: `${_letter.message}`,
            html:
                `<b>Имя отправителя:</b>  ${_letter.name} <br>
                 <b>email отправителя:</b>  ${_letter.email} <br> 
                 <b>Сообщение:</b>   <br>
                <p>${_letter.message}</p>`,
        });

        console.log(result); 
    } 
}