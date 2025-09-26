import { Request, Response } from "express";
import { JsonResponse } from "../../shared/http/JsonResponse.js";
import { UserService } from "./UserService.js";
import { UserRequestDto } from "./UserRequestDto.js";

class UserController {
  private readonly userService = new UserService();

  async create(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = UserRequestDto.fromRequest(request);
      const payload = dto.toCreateInput();
      if (!payload.success) {
        return responder.fromValidation(payload);
      }

      const user = await this.userService.create(payload.data);

      return responder.created(user);
    } catch (error) {
      return responder.error((error as Error).message);
    }
  }

  async update(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = UserRequestDto.fromRequest(request);
      const idResult = dto.getId();
      if (!idResult.success) {
        return responder.fromValidation(idResult);
      }

      const payload = dto.toUpdateInput();
      if (!payload.success) {
        return responder.fromValidation(payload);
      }

      const user = await this.userService.update(idResult.data, payload.data);

      return responder.success(user);
    } catch (error) {
      return responder.error((error as Error).message);
    }
  }

  async delete(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = UserRequestDto.fromRequest(request);
      const idResult = dto.getId();
      if (!idResult.success) {
        return responder.fromValidation(idResult);
      }

      await this.userService.delete(idResult.data);
      return responder.noContent();
    } catch (error) {
      return responder.error((error as Error).message, { status: 404 });
    }
  }

  async patch(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = UserRequestDto.fromRequest(request);
      const idResult = dto.getId();
      if (!idResult.success) {
        return responder.fromValidation(idResult);
      }

      const payload = dto.toUpdateInput();
      if (!payload.success) {
        return responder.fromValidation(payload);
      }

      const user = await this.userService.update(idResult.data, payload.data);

      return responder.success(user);
    } catch (error) {
      return responder.error((error as Error).message);
    }
  }
}

export { UserController };