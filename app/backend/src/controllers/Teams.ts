import { Request, Response } from 'express';
import ThrowError from '../utils/throwError';
import TeamService from '../services/Teams';

export default class teamsController {
  private _teamsService = new TeamService();

  async getAll(req: Request, res: Response) {
    try {
      const teams = await this._teamsService.getAll();
      return res.status(200).json(teams);
    } catch (error) {
      const { status, message } = error as ThrowError;
      return res.status(status).json({ message });
    }
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const teams = await this._teamsService.getById(id);
      return res.status(200).json(teams);
    } catch (error) {
      const { status, message } = error as ThrowError;
      return res.status(status).json({ message });
    }
  }
}
