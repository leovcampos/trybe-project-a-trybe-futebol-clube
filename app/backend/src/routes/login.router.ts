import { Router, Request, Response } from 'express';
import loginController from '../controllers/login.controller';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  loginController.login(req, res);
});

router.get('/validate', (req: Request, res: Response) => {
  loginController.userData(req, res);
});

export default router;
