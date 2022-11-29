import { Request, Response } from 'express';
import teamService from '../services/teams.service';

class TeamContoller {
  static async findAll(_req: Request, res: Response) {
    const allTeams = await teamService.findAll();
    return res.status(200).json(allTeams);
  }

  static async findById(req: Request, res: Response) {
    const { id } = req.params;
    const team = await teamService.findById(id);
    return res.status(200).json(team);
  }
}

export default TeamContoller;
