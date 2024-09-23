import express from 'express'
import dotenv from 'dotenv'; 
import { PrismaClient } from '@prisma/client';
import { apiRouter } from './routes/routes';
import cors from 'cors';

dotenv.config();
const prisma = new PrismaClient()
const app = express();
app.use(express.json());

app.use(cors())


async function main() {

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
