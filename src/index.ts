import express from 'express'
import dotenv from 'dotenv'; 
import { PrismaClient } from '@prisma/client';
import { apiRouter } from './routes/routes';
import cors from 'cors';
import { SubscriptionService } from './services/Subscription.service';
import { LifeStageCalc } from './calculation/lifeStage.calculation';
import helmet from 'helmet';
import compression from 'compression';
import bodyParser from 'body-parser'

dotenv.config();
const prisma = new PrismaClient() 
const app = express();
app.use(cors()); 
app.use(express.json());
app.use(helmet()); 
app.use(compression()); 

const subscriptionService = new SubscriptionService() 
const lifeStageCalc = new LifeStageCalc()

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
  // console.log(lifeStageCalc.destinyNumber(new Date(1999, 5, 21)))
  // console.log(lifeStageCalc.currentAge(new Date(1999, 5, 21)))
  // console.log(lifeStageCalc.soulNumber(new Date(1999, 5, 21)))   calcTaskPeriod
  // console.log(lifeStageCalc.durationPeriods(new Date(1999, 5, 21))) 