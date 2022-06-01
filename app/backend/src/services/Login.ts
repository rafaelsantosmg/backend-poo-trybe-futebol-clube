import ThrowError from '../utils/throwError';
import User from '../database/models/users';

export default class LoginService {
  private _user: object | null;
  private _throwError = new ThrowError(404, 'User not found');

  async login(email: string, password: string): Promise<object | null> {
    this._user = await User.findOne({
      where: { email, password }, attributes: { exclude: ['password'] },
    });
    if (!this._user) throw this._throwError;
    return this._user;
  }
}
