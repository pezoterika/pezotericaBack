import { DurationPeriods, LifeStageSeasons } from "src/types/lifeStageSeasons";
import { string } from "zod";


export class LifeStageCalc {


    // Задача периода
    calcTaskPeriod(_date: Date): LifeStageSeasons {
        let taskPeriodNumbers = new LifeStageSeasons();

        let [ sumDay, sumMonth, sumYear ] = this.sumNumberByDate(_date);
        
        taskPeriodNumbers.spring = Math.abs(this.sumNumber(sumDay + sumMonth));
        taskPeriodNumbers.summer = Math.abs(this.sumNumber(sumDay + sumYear));
        taskPeriodNumbers.autumn = Math.abs(this.sumNumber(taskPeriodNumbers.spring + taskPeriodNumbers.summer)); 
        taskPeriodNumbers.winter = Math.abs(this.sumNumber(sumMonth + sumYear)); 
        
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

    // Количество единиц
    numberUnits(_date: Date) {
        let firstNum = 0, secondNum = 0, thirdNum = 0;
        let dateStr = `${_date.getDate()}${_date.getMonth()}${_date.getFullYear()}`
    
        firstNum = Array.from(dateStr)
                        .reduce((sum, curVal) => sum + Number(curVal), 0);  

        secondNum = firstNum  < 10 ? firstNum 
                    : firstNum == 10 ? 1
                    : firstNum > 13 ? this.amountUptoMaximum(firstNum, 13) 
                    : 0;
        thirdNum = _date.getDate() < 10  // если первая цифра дня из даты рождения равна нулю
                   ? firstNum - 2 * _date.getDate()
                   : firstNum - 2 * Number(String(_date.getDate()).match(/\d/)[0])
        
        let fourthNum = Array.from(String(thirdNum)).reduce((sum, curVal) => sum + Number(curVal), 0);

        let res = Array.from(`${dateStr}${firstNum}${secondNum}${thirdNum}${fourthNum}`)
                       .filter(val => Number(val) == 1)
                       .length;

        // console.log(`${firstNum}   ${secondNum}   ${thirdNum}   ${fourthNum}  ${res}`);

        return res;
    }

    // Продолжительность периодов
    durationPeriods(_date: Date) : DurationPeriods {
        const res = new DurationPeriods();
        let destinyNumber = this.destinyNumber(_date);

        res.springBegin = 0;
        res.springEnd   = 36 - destinyNumber;

        res.summerBegin = res.springEnd + 1;
        res.summerEnd   = res.springEnd + destinyNumber; 

        res.autumnBegin = res.summerEnd + 1;
        res.autumnEnd   = res.summerEnd + destinyNumber;

        res.winterBegin = res.autumnEnd + 1;
        res.winterEnd   = -1;

        console.log(res)
        return res; 
    }

    // сумма всех цифр из первого вспомогательного (складываем цифры из числа до тех пор, пока не получим число, меньше 13) 
    amountUptoMaximum(_num: number, _maxVal = 13) {
        let res = 0;

        for(let char of _num.toString()) {
            res += parseInt(char)
        }
        if(res > 13)
           return  this.sumNumber(res)
        
        return res;
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


    // Число судьбы
    destinyNumber(_date: Date) {
        let [ sumDay, sumMonth, sumYear ] = this.sumNumberByDate(_date);
        let destinyNumber = this.sumNumber(sumDay + sumMonth + sumYear);
        
        return destinyNumber;
    }

    // Число души 
    soulNumber(_date: Date) {
        return this.sumNumber(_date.getDate())
    }

    // Текущий возраст
    currentAge(_date: Date) {
        let currentAge = 0;
        let curDate = new Date();
        
        if( (curDate.getDate() >= _date.getDate()) && (curDate.getMonth() >= _date.getMonth()) ) {
            currentAge = curDate.getFullYear() - _date.getFullYear(); 
        } 
        else currentAge = curDate.getFullYear() - _date.getFullYear() - 1;  
        
        return currentAge;
    }

    


}
