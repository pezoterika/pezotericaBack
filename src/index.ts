import express from 'express'
import dotenv from 'dotenv'; 
import { PrismaClient } from '@prisma/client';
import { apiRouter } from './routes/routes';
import cors from 'cors';
import { SubscriptionService } from './services/Subscription.service';
import { LifeStageCalc } from './calculation/lifeStage.calculation';

dotenv.config();
const prisma = new PrismaClient() 
const app = express();
app.use(cors()); 
app.use(express.json());
const subscriptionService = new SubscriptionService()
const lessonPeriodCalc = new LifeStageCalc()

async function main() {

  // new UserController().addIsAdminUsers()

  app.use('/api', apiRouter)

  // Все остальные end point
  app.all('*', (req, res) => { 
    res.status(404).json( { message: 'Not Found'})  
  })

  app.listen(process.env.PORT || 4200, () => {
    console.log(`Running on port ${process.env.PORT}`) 
  });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })


  subscriptionService.periodicOperation();     
  // console.log( lessonPeriodCalc.calcLessonPeriod(new Date(1999, 5, 21))); 
  