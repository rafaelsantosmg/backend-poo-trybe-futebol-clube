import { compare } from 'bcryptjs';
import ThrowError from '../utils/throwError';
import User from '../database/models/users';

export default class LoginService {
  private _erroUser = new ThrowError(401, 'Incorrect email or password');

  async login(email: string, password: string): Promise<object | null> {
    const user = await User.findOne({
      where: { email },
    });
    if (!user) throw this._erroUser;
    const validPassword = await compare(password, user.password);
    if (!validPassword) throw this._erroUser;
    const { id, username, role } = user;
    return {
      id,
      username,
      role,
      email,
    };
  }

  async loginValidate(id: number) {
    const user = await User.findOne({
      where: { id }, attributes: { exclude: ['password'] },
    });

    if (!user) throw this._erroUser;

    return user;
  }
}
