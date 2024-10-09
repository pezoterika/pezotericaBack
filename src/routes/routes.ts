import{ Router } from 'express';
import { AuthController } from 'src/controllers/auth.controller';
import { isUser, verifyResetPassword, verifyUserRefreshToken, verifyUserToken } from 'src/middleware/auth.middleware';
import { userCreateFieldValidator, userLoginFieldValidator } from 'src/middleware/userValidator.Middleware';
import { isAdmin } from '../middleware/auth.middleware';
import { AdviceDayController } from '../controllers/adviceDay.controller';
import { TaskPeriodController } from '../controllers/taskPeriod.controller';
import { LessonPeriodController } from '../controllers/lessonPeriod.controller';
import { UserController } from 'src/controllers/user.controller';
import { FeedbackController } from '../controllers/feedback.controller';


const router = Router();
const authController = new AuthController();
const adviceDayController = new AdviceDayController();
const taskPeriodController = new TaskPeriodController(); 
const lessonPeriodController = new LessonPeriodController()
const userController = new UserController();
const feedbackController = new FeedbackController();



router.get('/', async (req, res) => { res.send({ message: 'Hello! Is this API server' })});


router.post('/register', userCreateFieldValidator,  authController.register);       

router.get('/user/isexist', authController.userIsExist) 

router.get('/user/my', verifyUserToken, userController.myProfile)

router.post('/refreshToken', verifyUserRefreshToken, authController.refreshToken )  

router.post('/login', userLoginFieldValidator,  authController.login);              

router.post('/logout', verifyUserToken,  authController.logout); 

router.post('/forgot', authController.forgot)
router.get('/forgot', authController.checkForgot) 
router.post('/reset', verifyResetPassword, authController.reset)



router.post('/user', userCreateFieldValidator, verifyUserToken, isAdmin, userController.add)

// Обратная связь
router.post('/feedback', feedbackController.forward);


// Совет дня 
router.post('/adviceDay', adviceDayController.add);           
router.get('/adviceDay/:id', adviceDayController.getAdviceById);  
router.get('/adviceDay', adviceDayController.getAdviceByDate);

// Задача периода
router.post('/taskPeriod', taskPeriodController.add); 

// Урок периода
router.post('/lessonPeriod', lessonPeriodController.add)  
router.get('/lessonPeriod', lessonPeriodController.getLessonsByDate)

// Прогноз по жиненным этапам (период + урок)
router.get('/lifeStage', lessonPeriodController.getLessonsByDate)



// тестирование скрытие запросов
router.get('/testContent', verifyUserToken, async (req, res) => { res.send({ message: 'Test content for User' })});
router.get('/testContentAdmin', verifyUserToken, isAdmin, async (req, res) => { res.send({ message: 'Test content for Admin' })});

export const apiRouter = router;

 
