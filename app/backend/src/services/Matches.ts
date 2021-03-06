import ThrowError from '../utils/throwError';
import Matches from '../database/models/matches';
import Team from '../database/models/teams';
import { TMatche } from '../types/TMatche';

export default class MatcheService {
  private _matches: Matches[];
  private _matche: Matches;
  private _errorThrow = new ThrowError(401, 'inProgress invalid');

  async getAll(inProgress: string) {
    this._matches = await Matches.findAll({
      where: inProgress ? { inProgress: inProgress === 'true' } : {},
      include: [
        { model: Team, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: Team, as: 'teamAway', attributes: { exclude: ['id'] } },
      ],
    });
    return this._matches;
  }

  async create(matche: TMatche) {
    const { inProgress } = matche;
    if (inProgress === false) throw this._errorThrow;
    this._matche = await Matches.create(matche);
    return this._matche;
  }

  async finish(id: string) {
    const findMatche = await Matches.findOne({ where: { id } });
    if (!findMatche) throw this._errorThrow;
    await Matches.update(
      { inProgress: false },
      { where: { id } },
    );
  }

  async update(id: string, homeTeamGoals: number, awayTeamGoals: number) {
    const findMatche = await Matches.findOne({ where: { id } });
    if (!findMatche) throw this._errorThrow;
    await Matches.update(
      { homeTeamGoals, awayTeamGoals },
      { where: { id } },
    );
  }
}
