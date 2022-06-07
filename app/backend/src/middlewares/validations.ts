import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { TUserValidate } from '../types/TUser';
import Team from '../database/models/teams';
import LoginService from '../services/Login';
import TeamService from '../services/Teams';
import Token from '../utils/token';

export default class Validations {
  private _loginService = new LoginService();
  private _teamsService = new TeamService();
  private _token = new Token();

  joi = (req: Request, res: Response, next: NextFunction, schemas: Schema) => {
    const { error } = schemas.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };

  auth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'Token not found' });
    }
    const users = this._token.decoderToken(token);
    if (!users) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    const { user } = users as TUserValidate;
    const finduser = await this._loginService.loginValidate(user.id);
    if (!finduser) {
      return res.status(404).json({ message: 'User not found' });
    }
    req.body.user = finduser;
    next();
  };

  validateTeams = async (req: Request, res: Response, next: NextFunction) => {
    const teams: Team[] = await this._teamsService.getAll();
    if (req.body.homeTeam === req.body.awayTeam) {
      return res.status(401)
        .json({ message: 'It is not possible to create a match with two equal teams' });
    }
    const homeTeam: boolean = teams.some((team) => req.body.homeTeam === team.id);
    const awayTeam: boolean = teams.some((team) => req.body.awayTeam === team.id);
    if (homeTeam === false || awayTeam === false) {
      res.status(404).json({ message: 'There is no team with such id!' });
    }
    next();
  };
}
