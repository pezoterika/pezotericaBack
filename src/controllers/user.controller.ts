import { Request, Response, Router } from 'express';
import { UserService } from 'src/services/user.Service';


const router = Router();
const userService = new UserService();


// GET api/users
// Получение всех пользователей
router.get('/', async (req: Request, res: Response) => { 
    const users = await userService.findAllUsers();
    res.status(200).json(users);
})


// GET api/users/:id 
// Получение пользователя по id
router.get('/:id', async (req: Request, res: Response) => {

    const user = await userService.findById(parseInt(req.params.id, 10));
    if(user) {
        res.status(200).json(user);
    } 
    else res.status(404).json({ message: "User Not found." })
})

export const userController = router;


