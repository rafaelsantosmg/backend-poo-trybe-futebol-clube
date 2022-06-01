import { Application } from 'express';
import JoiSchemas from '../schemas/joiSchemas';
import LoginControler from '../controllers/Login';
import Validations from '../middlewares/validations';

export default class Routers {
  private _loginControler = new LoginControler();
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
}
