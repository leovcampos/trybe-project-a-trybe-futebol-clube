import { Router, Request, Response } from 'express';
import teamController from '../controllers/teams.controller';

const teams = Router();

teams.get('/', (req: Request, res: Response) => {
  teamController.findAll(req, res);
});

teams.get('/:id', (req: Request, res: Response) => {
  teamController.findById(req, res);
});
