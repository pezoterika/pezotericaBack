import { z } from "zod";

export const userCreateValidator = z.object({
    email:     z.string().email("Некорректно задана электронная почта"), 
    password:  z.string().min(6, "Пароль должен быть больше 6 символов"),
    firstName: z.string().min(2, "Имя должно быть больше 2-ух символов"),
    lastName:  z.string().min(2, "Фамилия должна быть больше 2-ух символов"),
    dateOfBirth: z.string().datetime("Дата должна быть задана в правильном формате ISO 8601")
});


export const userLoginValidator = z.object({
    email:     z.string().email("Некорректно задана электронная почта"), 
    password:  z.string().min(6, "Пароль должен быть больше 6 символов"),     
}).strict();  