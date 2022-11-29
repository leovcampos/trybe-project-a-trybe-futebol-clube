import { Router, Request, Response } from 'express';
import { TeamsController } from '../controllers';

const teams = Router();

teams.get('/', (req: Request, res: Response) => TeamsController.getAll(req, res));
teams.get('/:id', (req: Request, res: Response) => TeamsController.getTeam(req, res));

export default teams;
