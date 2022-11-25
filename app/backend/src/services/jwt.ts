// import * as jwt from 'jsonwebtoken';
// import { JwtPayload } from 'jsonwebtoken';

// interface ITokenGenerate {
//   generate(string: string): string
// }

// interface ITokenValidate {
//   validate(token: string): JwtPayload
// }

// class JwtAuth implements ITokenGenerate, ITokenValidate {
//   private secret = process.env.JWT_SECRET || 'jwt_secret';
//   private jwtConfig: jwt.SignOptions = {
//     expiresIn: '7d',
//     algorithm: 'HS256',
//   };

//   generate(email: string): string {
//     return jwt.sign({ email }, this.secret as string, this.jwtConfig);
//   }

//   validate(token: string): JwtPayload {
//     return jwt.verify(token, this.secret) as JwtPayload;
//   }
// }

// export default JwtAuth;
