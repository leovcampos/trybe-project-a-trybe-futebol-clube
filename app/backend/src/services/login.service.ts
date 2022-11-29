import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import User from '../database/models/User';

interface IReponse {
  statusCode: number | null,
  message: object | string,
}

class LoginService {
  private static generateToken(userId: number): string {
    const token = jwt.sign({ data: { id: userId } }, process.env.JWT_SECRET as string);
    return token;
  }

  private static decodeToken(token: string) {
    const decoded = jwt.decode(token);
    return decoded as jwt.JwtPayload;
  }

  static async login(email: string, password: string): Promise<IReponse> {
    if (!email || !password) {
      return { statusCode: 400, message: { message: 'All fields must be filled' } };
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return { statusCode: 401, message: { message: 'Incorrect email or password' } };
    }

    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword) {
      return { statusCode: 401, message: { message: 'Incorrect email or password' } };
    }

    const token = LoginService.generateToken(user.id);

    return { statusCode: null, message: token };
  }

  static async userData(token: string): Promise<string | undefined> {
    const decoded = LoginService.decodeToken(token);
    const user = await User.findByPk(decoded.data.id, { attributes: ['role'] });
    return user?.role;
  }
}

export default LoginService;
