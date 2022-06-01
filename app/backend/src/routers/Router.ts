import { Application } from 'express';
import JoiSchemas from '../schemas/joiSchemas';
import LoginControler from '../controllers/Login';
import ValidateJoi from '../middlewares/validateJoi';

export default class Routers {
  private _loginControler = new LoginControler();
  private _validateJoi = new ValidateJoi();
  private _joiSchemas = new JoiSchemas();

  public login(app: Application): void {
    app.post(
      '/login',
      (req, res, next) => this._validateJoi.joi(req, res, next, this._joiSchemas.login),
      (req, res) => this._loginControler.login(req, res),
    );
  }
}
