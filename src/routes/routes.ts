import{ Router } from 'express';
import { AuthController } from 'src/controllers/auth.controller';
import { isUser, verifyUserRefreshToken, verifyUserToken } from 'src/middleware/auth.middleware';
import { userCreateFieldValidator, userLoginFieldValidator } from 'src/middleware/userValidator.Middleware';
import { isAdmin } from '../middleware/auth.middleware';

const router = Router();
const authController = new AuthController();

router.get('/', async (req, res) => { res.send({ message: 'Hello! Is this API server' })});

router.post('/register', userCreateFieldValidator,  authController.register);

router.post('/refreshToken', verifyUserRefreshToken, authController.refreshToken );

router.post('/login', userLoginFieldValidator,  authController.login);

router.post('/logout', verifyUserToken,  authController.logout);

router.get('/testContent', verifyUserToken, async (req, res) => { res.send({ message: 'Test content for User' })});

router.get('/testContentAdmin', verifyUserToken, isAdmin, async (req, res) => { res.send({ message: 'Test content for Admin' })});

export const apiRouter = router;