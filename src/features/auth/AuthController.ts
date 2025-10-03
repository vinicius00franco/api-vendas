import { Request, Response } from "express";
import { JsonResponse } from "../../shared/http/JsonResponse.js";
import { AuthService } from "./AuthService.js";
import { AuthRequestDto } from "./AuthRequestDto.js";

class AuthController {
  async login(request: Request, response: Response): Promise<Response> {
    const authService = new AuthService();
    const responder = JsonResponse.using(response);
    try {
      const dto = AuthRequestDto.fromRequest(request);
      const payload = dto.toLoginInput();
      if (!payload.success) {
        return responder.fromValidation(payload);
      }

      const result = await authService.login(payload.data);
      return responder.success(result);
    } catch (error) {
      return responder.error((error as Error).message, { status: 401 });
    }
  }
}

export { AuthController };
