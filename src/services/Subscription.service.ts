import { PrismaClient } from "@prisma/client"
import schedule from "node-schedule";

export class SubscriptionService {
    
    prisma = new PrismaClient;

    periodicOperation() {
        schedule.scheduleJob('00 01 * * *', this.updateSubscriptions)
    }

    updateSubscriptions(){
        console.log("updateSubscriptions");
    }
}