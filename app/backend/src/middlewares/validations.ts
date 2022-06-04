import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import LoginService from '../services/Login';
import Token from '../utils/token';
import { TUserValidate } from '../types/TUser';

export default class Validations {
  private _loginService = new LoginService();
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
    req.body = finduser;
    next();
  };
}
