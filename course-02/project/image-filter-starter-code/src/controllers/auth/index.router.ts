import { Router, Request, Response } from 'express';
import { AuthRouter } from './routes/auth.router';


const router: Router = Router();

router.use('/users/auth', AuthRouter);

router.get('/', async (req: Request, res: Response) => {    
    res.send(`V0`);
});

export const IndexRouter: Router = router;