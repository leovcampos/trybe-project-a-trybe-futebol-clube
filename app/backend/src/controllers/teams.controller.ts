import { Request, Response } from 'express';
import { TeamsService } from '../services';

export default class TeamsController {
  constructor(private service = new TeamsService()) {}

  async findAll(_req:Request, res:Response): Promise<void> {
    const response = await this.service.findAll();
    const { status, message } = response;
    res.status(status).json(message);
  }

  async findOne(req:Request, res:Response): Promise<void> {
    const { id } = req.params;
    const response = await this.service.findOne(id);
    const { status, message } = response;
    res.status(status).json(message);
  }
}
