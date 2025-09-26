import { Request, Response } from "express";
import { AuthService } from "./AuthService.js";
import { AuthRequestDto } from "./AuthRequestDto.js";

class AuthController {
  private readonly authService = new AuthService();

  async login(request: Request, response: Response): Promise<Response> {
    try {
      const dto = AuthRequestDto.fromRequest(request);
      const payload = dto.toLoginInput();
      if (!payload.success) {
        return response.status(payload.status ?? 400).json({ message: payload.message });
      }

      const result = await this.authService.login(payload.data);
      return response.json(result);
    } catch (error) {
      return response.status(401).json({ message: (error as Error).message });
    }
  }
}

export { AuthController };
