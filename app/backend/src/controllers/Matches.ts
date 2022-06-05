import { Request, Response } from 'express';
import MatcheService from '../services/Matches';
import ThrowError from '../utils/throwError';

export default class MatchesController {
  private _matcheService = new MatcheService();
  private _inProgress: boolean;

  async getAll(req: Request, res: Response) {
    const { inProgress } = req.query;
    this._inProgress = inProgress === 'true';
    const matches = await this._matcheService.getAll(this._inProgress);
    return res.status(200).json(matches);
  }

  async create(req: Request, res: Response) {
    try {
      console.log('Controller', req.body);
      const matche = await this._matcheService.create(req.body);
      return res.status(201).json(matche);
    } catch (error) {
      const { status, message } = error as ThrowError;
      return res.status(status).json({ message });
    }
  }
}
