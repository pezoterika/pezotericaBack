import{ Router } from 'express';
import { AuthController } from 'src/controllers/auth.controller';
import { isUser, verifyUserRefreshToken, verifyUserToken } from 'src/middleware/auth.middleware';
import { userCreateFieldValidator, userLoginFieldValidator } from 'src/middleware/userValidator.Middleware';
import { isAdmin } from '../middleware/auth.middleware';
import { AdviceDayController } from '../controllers/adviceDay.controller';
import { TaskPeriodController } from '../controllers/taskPeriod.controller';
import { LessonPeriodController } from '../controllers/lessonPeriod.controller';

const router = Router();
const authController = new AuthController();
const adviceDayController = new AdviceDayController();
const taskPeriodController = new TaskPeriodController(); 
const lessonPeriodController = new LessonPeriodController()

router.get('/', async (req, res) => { res.send({ message: 'Hello! Is this API server' })});

router.post('/register', userCreateFieldValidator,  authController.register);

router.post('/refreshToken', verifyUserRefreshToken, authController.refreshToken );

router.post('/login', userLoginFieldValidator,  authController.login); 

router.post('/logout', verifyUserToken,  authController.logout);

router.get('/testContent', verifyUserToken, async (req, res) => { res.send({ message: 'Test content for User' })});

router.get('/testContentAdmin', verifyUserToken, isAdmin, async (req, res) => { res.send({ message: 'Test content for Admin' })});


/* Заполнение БД */

// Совет дня 
router.post('/adviceDay', adviceDayController.add);           
router.get('/adviceDay/:id', adviceDayController.getAdviceById);  
router.get('/adviceDay', adviceDayController.getAdviceByDate);

// Задача периода (добавление)
router.post('/taskPeriod', taskPeriodController.add);

// Урок периода
router.post('/lessonPeriod', lessonPeriodController.add)
 

export const apiRouter = router;