import Matches from '../database/models/matches';
import Team from '../database/models/teams';

export default class MatcheService {
  private _matches: Matches[];
  private _matche: Matches | null;

  async getAll(inProgress: boolean) {
    if (inProgress) {
      this._matches = await Matches.findAll({
        where: { inProgress },
        include: [
          { model: Team, as: 'teamHome', attributes: { exclude: ['id'] } },
          { model: Team, as: 'teamAway', attributes: { exclude: ['id'] } },
        ],
      });
      return this._matches;
    }
    this._matches = await Matches.findAll({
      include: [
        { model: Team, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: Team, as: 'teamAway', attributes: { exclude: ['id'] } },
      ],
    });
    return this._matches;
  }

  async getSearch(query: string) {
    this._matche = await Matches.findOne({ where: { inProgress: query } });
    return this._matche;
  }
}
