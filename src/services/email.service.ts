import { User } from '@prisma/client';
import nodemailer from 'nodemailer';
import { Feedback } from 'src/types/feedback.interface';

export class EmailService {

    transporter = nodemailer.createTransport({
        host: 'smtp.yandex.ru',
        port: 465,
        secure: true,
        auth: {
            user: 'pezoterika', 
            pass: 'ryshdstgtqrmorky',  
        },
    });

    // переслать письмо
    async forwardLetter(_letter: Feedback) {

        let result = await this.transporter.sendMail({
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

 
    // забыл пароль 
    async sendEmailForgot(_user: User, _tokenForgot: string) {

        let result = await this.transporter.sendMail({
            from: 'pezoterika@yandex.ru',
            to: `${_user.email}`, 
            //to: `${_user.email}`,
            subject: `Восстановление пароля Мир-и-я`,
            //text: `${_letter.message}`,
            html:
                `<p>Здравствуйте, ${_user.firstName}</p>
                Для сброса пароля перейдите по указанной ссылке: <br>
                http://localhost:4200/reset?key=${_tokenForgot}<br>
                Если вы не отправляли запрос на восстановление пароля, то
                проигнорируйте данное сообщение.`,
        });

        console.log(result);
        console.log(_user.email); 
    }
    
    
}