import { Request, Response, Router } from 'express';
import { TwitService } from './twit.service';
import { authMiddleware } from './auth.twit.middleware';
import { createTwitDto } from './twit.dto';

const router = Router();
const twitService = new TwitService();

router.post('/', authMiddleware, async (req: Request, res: Response) => {

    const validation = createTwitDto.safeParse(req.body);
    if(!validation.success){
        return res.status(400).json( { message : validation.error.errors})
    }
    /*
    if(!req.body.text?.length) {
        return res.status(400).json( { message : 'Message is required' })
    }
    */
    

    //const twit = await twitService.createTwit(req.body);
    //res.status(201).json(twit);
})


export const twitRouter = router; 