export class LifeStageSeasons {
    spring: string | number = ''; 
    winter: string | number  = '';
    summer: string | number  = '';
    autumn: string | number = '';

    springGoal: string = '';
    winterGoal: string = '';
    summerGoal: string = '';
    autumnGoal: string = '';
}

export class DurationPeriods {
    springBegin: number;
    springEnd: number;
    
    winterBegin: number;
    winterEnd:   number;
 
    summerBegin: number;
    summerEnd:   number;  

    autumnBegin: number;
    autumnEnd:   number;
}


export class TaskPeriodFind {
    task: string;
    strategicGoal: string; 
}