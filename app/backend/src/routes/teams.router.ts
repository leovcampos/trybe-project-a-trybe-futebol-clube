import { Router, Request, Response } from 'express';
import teamController from '../controllers/teams.controller';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  teamController.findAll(req, res);
});

router.get('/:id', (req: Request, res: Response) => {
  teamController.findById(req, res);
});

export default router;
