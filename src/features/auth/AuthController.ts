import { Request, Response } from "express";
import { AuthService } from "./AuthService.js";

class AuthController {
  private readonly authService = new AuthService();

  async login(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    try {
      const result = await this.authService.login({ email, password });
      return response.json(result);
    } catch (error) {
      return response.status(401).json({ message: (error as Error).message });
    }
  }
}

export { AuthController };
