import { Request, Response } from 'express';
import Token from '../utils/token';
import LoginService from '../services/Login';
import ThrowError from '../utils/throwError';

export default class LoginControler {
  public loginService = new LoginService();
  private _token = new Token();
  private _user: object | null;

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const user = await this.loginService.login(email, password);
      const token = this._token.createToken(user);
      return res.status(200).json({ user, token });
    } catch (error) {
      return res.status((error as ThrowError).status).json(({ message: (error as Error).message }));
    }
  }
}
