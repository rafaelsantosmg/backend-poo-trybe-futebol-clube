import { Request, Response } from 'express';
import LeaderBoardHomeService from '../services/LeaderBoardHome';
import LeaderBoardAwayService from '../services/LeaderBoardAway';

export default class LeaderBoardController {
  private _leaderBoardHomeService = new LeaderBoardHomeService();
  private _leaderBoardAwayService = new LeaderBoardAwayService();

  async getHome(_req: Request, res: Response) {
    const teams = await this._leaderBoardHomeService.getHome();
    return res.status(200).json(teams);
  }

  async getAway(_req: Request, res: Response) {
    const teams = await this._leaderBoardAwayService.getAway();
    return res.status(200).json(teams);
  }
}
