import { Request, Response } from 'express';
import LeaderBoardService from '../services/LeaderBorard';

export default class LeaderBoardController {
  private _leaderBoardService = new LeaderBoardService();

  async getAll(_req: Request, res: Response) {
    const teams = await this._leaderBoardService.getAll();
    return res.status(200).json(teams);
  }
}
