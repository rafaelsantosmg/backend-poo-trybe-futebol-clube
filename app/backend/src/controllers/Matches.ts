import { Request, Response } from 'express';
import MatcheService from '../services/Matches';

export default class MatchesController {
  private _matcheService = new MatcheService();
  private _inProgress: boolean;

  async getAll(req: Request, res: Response) {
    const { inProgress } = req.query;
    this._inProgress = inProgress === 'true';
    const matches = await this._matcheService.getAll(this._inProgress);
    return res.status(200).json(matches);
  }
}
