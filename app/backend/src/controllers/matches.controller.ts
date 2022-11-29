import { Request, Response } from 'express';
import IMatchCreationRequest from '../interfaces/IMatchCreationRequest';
import { MatchesService } from '../services';

class MatchesController {
  static async getAll(req: Request, res: Response) {
    const { inProgress = 'all' } = req.query;
    const matches = await MatchesService.getAll(inProgress as string);
    return res.status(200).json(matches);
  }

  static async add(req: Request, res: Response) {
    const matchCreationRequest = req.body as IMatchCreationRequest;
    const { type, message } = await MatchesService.add(matchCreationRequest);
    if (type) {
      return res.status(type).json({ message });
    }

    return res.status(201).json(message);
  }

  static async finishGame(req: Request, res: Response) {
    const { id } = req.params;
    await MatchesService.finishGame(id);
    return res.status(200).json({ message: 'Finished' });
  }

  static async updateGame(req: Request, res: Response) {
    const { homeTeamGoals, awayTeamGoals } = req.body;
    const { id } = req.params;
    const match = await MatchesService.updateGame(id, homeTeamGoals, awayTeamGoals);
    return res.status(200).json(match);
  }
}

export default MatchesController;
