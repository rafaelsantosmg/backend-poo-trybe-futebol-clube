import Teams from '../database/models/teams';

export default class TeamService {
  private _teams: Teams[];
  private _team: Teams | null;

  async getAll() {
    this._teams = await Teams.findAll();
    return this._teams;
  }

  async getById(id: string) {
    this._team = await Teams.findOne({ where: { id } });
    return this._team;
  }
}
