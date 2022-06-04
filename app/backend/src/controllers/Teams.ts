import { Request, Response } from 'express';
import TeamService from '../services/Teams';

export default class teamsController {
  private _teamsService = new TeamService();

  async getAll(req: Request, res: Response) {
    const teams = await this._teamsService.getAll();
    return res.status(200).json(teams);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const teams = await this._teamsService.getById(id);
    return res.status(200).json(teams);
  }
}
