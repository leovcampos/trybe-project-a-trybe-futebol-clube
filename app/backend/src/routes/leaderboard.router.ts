import { Router, Request, Response } from 'express';
import { LeaderBoardController } from '../controllers';

const leaderBoard = Router();

leaderBoard.get('/', (req: Request, res: Response) => {
  LeaderBoardController.get(req, res);
});

leaderBoard.get('/home', (req: Request, res: Response) => {
  LeaderBoardController.getHome(req, res);
});

leaderBoard.get('/away', (req: Request, res: Response) => {
  LeaderBoardController.getAway(req, res);
});

export default leaderBoard;
