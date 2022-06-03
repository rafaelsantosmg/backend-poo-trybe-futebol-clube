import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import User from '../database/models/users';
import Token from '../utils/token';

interface Users {
  user: {
    id?: number;
    username?: string;
    role?: string;
    email?: number;
  }
}

export default class Validations {
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
    const user = this._token.decoderToken(token);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    const { id } = (user as Users).user;
    const finduser = await User.findOne({ where: { id } });
    if (!finduser) {
      return res.status(404).json({ message: 'User not found' });
    }
    req.body = user;
    next();
  };
}