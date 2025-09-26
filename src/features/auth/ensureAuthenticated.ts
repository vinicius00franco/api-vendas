import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { UserService, type SafeUser } from "../user/UserService.js";

export type TokenPayload = {
  sub: string;
  email: string;
  isAdmin: boolean;
  iat: number;
  exp: number;
};

export type AuthenticatedRequest = Request & {
  currentUser: SafeUser;
  tokenPayload: TokenPayload;
};

const userService = new UserService();

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({ message: "Token de autenticação não informado" });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return response.status(401).json({ message: "Token de autenticação inválido" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return response.status(500).json({ message: "JWT_SECRET não configurado" });
  }

  try {
    const decoded = verify(token, secret) as TokenPayload;

    const user = await userService.findByUuid(decoded.sub);
    if (!user) {
      return response.status(401).json({ message: "Usuário não encontrado" });
    }

    (request as AuthenticatedRequest).currentUser = user;
    (request as AuthenticatedRequest).tokenPayload = decoded;

    return next();
  } catch (error) {
    return response.status(401).json({ message: "Token de autenticação inválido" });
  }
}
