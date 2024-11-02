export class AdviceDayCalc {

    // по дате получаем число 
    calcNumberByDate(birthDate: Date) {
         
        let curDate =  new Date();
        let calcDate;

        if (curDate.getMonth() > birthDate.getMonth())
        {
            calcDate = new Date(Date.UTC(curDate.getFullYear(), birthDate.getMonth(), birthDate.getDate()));
        }
        else if (curDate.getMonth() < birthDate.getMonth())
        {
            calcDate = new Date(Date.UTC(curDate.getFullYear() - 1, birthDate.getMonth(), birthDate.getDate()));
        }
        else if (curDate.getMonth() == birthDate.getMonth())
        {
            calcDate = curDate.getDate() >= birthDate.getDate() 
                        ? new Date(Date.UTC(curDate.getFullYear(), birthDate.getMonth(), birthDate.getDate())) 
                        : new Date(Date.UTC(curDate.getFullYear() - 1, birthDate.getMonth(), birthDate.getDate()));
        }
        /*let calcDate: Date =  curDate.getDate() >= birthDate.getDate() 
                        ? new Date(curDate.getFullYear(), birthDate.getMonth(), birthDate.getDate()) 
                        : new Date(curDate.getFullYear() - 1, birthDate.getMonth(), birthDate.getDate());*/
             
        // пункт 1
        // сумма цифр даты
        let sumNumDate = calcDate.getDate()
                        +  (calcDate.getMonth() + 1)
                        +  Array.from(String(calcDate.getFullYear()))
                            .map((n: string) => { return parseInt(n) })
                            .reduce((sum, value) =>  sum + value, 0);
        sumNumDate = sumNumDate > 78 ? 78 - sumNumDate : sumNumDate;

        // пункт 3
        let res = sumNumDate + (curDate.getMonth() + 1) + curDate.getDate();  
        res = res > 78 ? 78 - res : res;
        
        return Math.abs(res); 
    }
}