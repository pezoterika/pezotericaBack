import { LifeStageSeasons } from "src/types/lifeStageSeasons";
import { string } from "zod";

export class LifeStageCalc {


    calcTaskPeriod(_date: Date): LifeStageSeasons {

        let taskPeriodNumbers = new LifeStageSeasons();

        let [ sumDay, sumMonth, sumYear ] = this.sumNumberByDate(_date);
        
        taskPeriodNumbers.spring = Math.abs(this.sumNumber(sumDay + sumMonth));
        taskPeriodNumbers.summer = Math.abs(this.sumNumber(sumDay + sumYear));
        taskPeriodNumbers.autumn = Math.abs(this.sumNumber(taskPeriodNumbers.spring - taskPeriodNumbers.summer)); 
        taskPeriodNumbers.winter = Math.abs(this.sumNumber(sumMonth - sumYear)); 
        
        return taskPeriodNumbers;
    }

    // Урок периода (числа)
    calcLessonPeriod(_date: Date) : LifeStageSeasons {

       let lessonPeriodNumbers = new LifeStageSeasons();
       
       let [ sumDay, sumMonth, sumYear ] = this.sumNumberByDate(_date);
       console.log(`sumDay=${sumDay}  sumMonth=${sumMonth}  sumYear=${sumYear}`)

       lessonPeriodNumbers.spring = this.sumNumber(Math.abs(sumDay - sumMonth));
       lessonPeriodNumbers.summer = this.sumNumber(Math.abs(sumDay - sumYear));
       lessonPeriodNumbers.autumn = this.sumNumber(Math.abs(<number>lessonPeriodNumbers.spring - <number>lessonPeriodNumbers.summer));
       lessonPeriodNumbers.winter = this.sumNumber(Math.abs(sumMonth - sumYear));  

       return lessonPeriodNumbers; 
    }

    // Сумма числа до однозначного числа
    sumNumber(_num: number){
        let res = 0;

        for(let char of _num.toString()) {
            res += parseInt(char)
        }
        if(res >= 10)
           return  this.sumNumber(res)

        return res;
    }

    // Сумма чисел до однозначного числа для дня, месяца и года
    sumNumberByDate(_date: Date): number[]{
        return [ this.sumNumber(_date.getDate()), 
                 this.sumNumber(_date.getMonth()), 
                 this.sumNumber(_date.getFullYear()) ];
    }
}
