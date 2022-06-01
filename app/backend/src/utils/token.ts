import { sign, verify } from 'jsonwebtoken';
import { readFileSync } from 'fs';

export default class Token {
  private _JWT_SECRET = readFileSync('./jwt.evaluation.key', { encoding: 'utf-8' });

  createToken(user: object | null) {
    const token = sign({ user }, this._JWT_SECRET, {
      expiresIn: '7d',
      algorithm: 'HS256',
    });

    return token;
  }

  decoderToken(token: string) {
    try {
      const decoder = verify(token, this._JWT_SECRET);
      return decoder;
    } catch (error) {
      return false;
    }
  }
}
