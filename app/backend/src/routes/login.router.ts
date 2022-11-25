import { Router, Request, Response } from 'express';
import loginController from '../controllers/login.controller';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  loginController.login(req, res);
});

export default router;
