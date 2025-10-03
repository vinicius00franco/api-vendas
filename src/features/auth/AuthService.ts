import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";
import { User } from "../user/User.js";
import UserService, { type SafeUser } from "../user/UserService.js";

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: SafeUser;
};

class AuthService {
  constructor(private readonly userService = new UserService()) {}

  async login({ email, password }: LoginInput): Promise<LoginResponse> {
    const user = await this.userService.findByEmailWithPassword(email);
    if (!user) {
      throw new Error("Credenciais inválidas");
    }

    const isValid = await this.userService.verifyPassword(user, password);
    if (!isValid) {
      throw new Error("Credenciais inválidas");
    }

    const token = this.generateToken(user);
    return {
      token,
      user: this.userService.toSafeUser(user),
    };
  }

  private generateToken(user: User): string {
    const secret = process.env.JWT_SECRET as Secret | undefined;
    if (!secret) {
      throw new Error("JWT_SECRET não configurado");
    }

    const expiresInEnv = process.env.JWT_EXPIRES_IN as StringValue | undefined;
    const signOptions: SignOptions = {
      expiresIn: expiresInEnv ?? ("1d" as StringValue),
    };

    return jwt.sign(
      {
        sub: user.uuid,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      secret,
      signOptions
    );
  }
}

export { AuthService };
