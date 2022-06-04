import { Request, Response } from 'express';
import Token from '../utils/token';
import LoginService from '../services/Login';
import ThrowError from '../utils/throwError';
import { TUserModel } from '../types/TUser';

export default class LoginController {
  public loginService = new LoginService();
  private _token = new Token();
  private _user: TUserModel ;

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const user = await this.loginService.login(email, password);
      const token = this._token.createToken(user);
      return res.status(200).json({ user, token });
    } catch (error) {
      const { status, message } = error as ThrowError;
      return res.status(status).json({ message });
    }
  }

  async loginValidate(req: Request, res: Response) {
    this._user = req.body;
    try {
      return res.status(200).json(this._user.role);
    } catch (error) {
      const { status, message } = error as ThrowError;
      return res.status(status).json({ message });
    }
  }
}
