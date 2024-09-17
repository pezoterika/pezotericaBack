import{ Router } from 'express';
import { AuthController } from 'src/controllers/auth.controller';
import { verifyUserRefreshToken, verifyUserToken } from 'src/middleware/auth.middleware';
import { userCreateFieldValidator, userLoginFieldValidator } from 'src/middleware/userValidator.Middleware';

const router = Router();
const authController = new AuthController();

router.get('/', async (req, res) => { res.send({ message: 'Hello! Is this API server' })});

router.post('/register', userCreateFieldValidator,  authController.register);

router.post('/refreshToken', verifyUserRefreshToken, authController.refreshToken );

router.post('/login', userLoginFieldValidator,  authController.login);

router.post('/logout', verifyUserToken,  authController.logout);

router.get('/testContent', verifyUserToken,  async (req, res) => { res.send({ message: 'Test content' })});

export const apiRouter = router;