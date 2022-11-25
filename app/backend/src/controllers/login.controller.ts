import { Request, Response } from 'express';
import loginService from '../services/login.service';

class loginController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const { statusCode, message } = await loginService.login(email, password);

    if (statusCode) {
      return res.status(statusCode).json(message);
    }

    return res.status(200).json({ token: message });
  }
}

export default loginController;
