import { Request, Response } from 'express';
import { LeaderBoardService } from '../services';

class LeaderBoardController {
  static async get(req: Request, res: Response) {
    const leaderBoard = await LeaderBoardService.get();
    return res.status(200).json(leaderBoard);
  }

  static async getHome(req: Request, res: Response) {
    const leaderBoardHome = await LeaderBoardService.getHome();
    return res.status(200).json(leaderBoardHome);
  }

  static async getAway(req: Request, res: Response) {
    const leaderBoard = await LeaderBoardService.getAway();
    return res.status(200).json(leaderBoard);
  }
}

export default LeaderBoardController;
