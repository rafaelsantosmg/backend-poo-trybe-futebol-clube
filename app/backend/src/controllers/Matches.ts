import { Request, Response } from 'express';
import ThrowError from '../utils/throwError';
import MatcheService from '../services/Matches';

export default class MatchesController {
  private _matcheService = new MatcheService();
  private _inProgress: boolean;

  async getAll(req: Request, res: Response) {
    const { inProgress } = req.query;
    this._inProgress = inProgress === 'true';
    try {
      const matches = await this._matcheService.getAll(this._inProgress);
      return res.status(200).json(matches);
    } catch (error) {
      console.log(error);
      const { status, message } = error as ThrowError;
      return res.status(status).json({ message });
    }
  }
}
