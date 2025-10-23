import { Request, Response } from "express";
import { JsonResponse } from "../../shared/http/JsonResponse.js";
import UserService from "./UserService.js";
import { UserRequestDto } from "./UserRequestDto.js";

class UserController {
  private userService = new UserService();

  async create(request: Request, response: Response) {
    const userService = new UserService();
    const responder = JsonResponse.using(response);
    try {
      const dto = UserRequestDto.fromRequest(request);
      const payload = dto.toCreateInput();
      if (!payload.success) {
        return responder.fromValidation(payload);
      }

      const user = await userService.create(payload.data);

      const responseData = {
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return responder.created(responseData);
    } catch (error) {
      return responder.error((error as Error).message);
    }
  }

  async update(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = UserRequestDto.fromRequest(request);
      const uuidResult = dto.getUuid();
      if (!uuidResult.success) {
        return responder.fromValidation(uuidResult);
      }

      const payload = dto.toUpdateInput();
      if (!payload.success) {
        return responder.fromValidation(payload);
      }

      const user = await this.userService.updateByUuid(uuidResult.data, payload.data);

      return responder.success(user);
    } catch (error) {
      return responder.error((error as Error).message);
    }
  }

  async delete(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = UserRequestDto.fromRequest(request);
      const uuidResult = dto.getUuid();
      if (!uuidResult.success) {
        return responder.fromValidation(uuidResult);
      }

      const deletedUuid = await this.userService.deleteByUuid(uuidResult.data);
      return responder.success({ message: `Usuário com UUID ${deletedUuid} foi deletado com sucesso` });
    } catch (error) {
      return responder.error((error as Error).message, { status: 404 });
    }
  }

  async patch(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = UserRequestDto.fromRequest(request);
      const uuidResult = dto.getUuid();
      if (!uuidResult.success) {
        return responder.fromValidation(uuidResult);
      }

      const payload = dto.toUpdateInput();
      if (!payload.success) {
        return responder.fromValidation(payload);
      }

      const user = await this.userService.updateByUuid(uuidResult.data, payload.data);

      return responder.success(user);
    } catch (error) {
      return responder.error((error as Error).message);
    }
  }

  async getAll(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const users = await this.userService.findAll();
      return responder.success(users);
    } catch (error) {
      return responder.error((error as Error).message);
    }
  }

  async getById(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = UserRequestDto.fromRequest(request);
      const uuidResult = dto.getUuid();
      if (!uuidResult.success) {
        return responder.fromValidation(uuidResult);
      }

      const user = await this.userService.findByUuid(uuidResult.data);
      if (!user) {
        return responder.error("Usuário não encontrado", { status: 404 });
      }

      return responder.success(user);
    } catch (error) {
      return responder.error((error as Error).message);
    }
  }
}

export { UserController };