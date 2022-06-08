import { Application } from 'express';
import JoiSchemas from '../schemas/joiSchemas';
import LoginControler from '../controllers/Login';
import TeamsControler from '../controllers/Teams';
import MatchesController from '../controllers/Matches';
import Validations from '../middlewares/validations';
import LeaderBoardController from '../controllers/LeaderBoard';

export default class Routers {
  private _loginControler = new LoginControler();
  private _teamsController = new TeamsControler();
  private _leaderBoardController = new LeaderBoardController();

  private _matchesController = new MatchesController();
  private _validations = new Validations();
  private _joiSchemas = new JoiSchemas();

  public login(app: Application): void {
    app.get(
      '/login/validate',
      (req, res, next) => this._validations.auth(req, res, next),
      (req, res) => this._loginControler.loginValidate(req, res),
    );

    app.post(
      '/login',
      (req, res, next) => this._validations.joi(req, res, next, this._joiSchemas.login),
      (req, res) => this._loginControler.login(req, res),
    );
  }

  public teams(app:Application): void {
    app.get(
      '/teams/:id',
      (req, res) => this._teamsController.getById(req, res),
    );
    app.get(
      '/teams',
      (req, res) => this._teamsController.getAll(req, res),
    );
  }

  public matches(app:Application): void {
    app.patch(
      '/matches/:id/finish',
      (req, res) => this._matchesController.finish(req, res),
    );
    app.patch(
      '/matches/:id',
      (req, res, next) => this._validations.joi(req, res, next, this._joiSchemas.matches),
      (req, res) => this._matchesController.update(req, res),
    );
    app.get('/matches', (req, res) => this._matchesController.getAll(req, res));
    app.post(
      '/matches',
      (req, res, next) => this._validations.auth(req, res, next),
      (req, res, next) => this._validations.validateTeams(req, res, next),
      (req, res, next) => this._validations.joi(req, res, next, this._joiSchemas.matches),
      (req, res) => this._matchesController.create(req, res),
    );
  }

  public leaderboard(app: Application): void {
    app.get(
      '/leaderboard/home',
      (req, res) => this._leaderBoardController.getHome(req, res),
    );
    app.get(
      '/leaderboard/away',
      (req, res) => this._leaderBoardController.getAway(req, res),
    );
  }
}
