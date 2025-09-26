import { Request, Response } from "express";
import { UserService } from "./UserService.js";
import { UserRequestDto } from "./UserRequestDto.js";

class UserController {
  private readonly userService = new UserService();

  async create(request: Request, response: Response) {
    try {
      const dto = UserRequestDto.fromRequest(request);
      const payload = dto.toCreateInput();
      if (!payload.success) {
        return response.status(payload.status ?? 400).json({ message: payload.message });
      }

      const user = await this.userService.create(payload.data);

      return response.status(201).json(user);
    } catch (error) {
      return response.status(400).json({ message: (error as Error).message });
    }
  }

  async update(request: Request, response: Response) {
    try {
      const dto = UserRequestDto.fromRequest(request);
      const idResult = dto.getId();
      if (!idResult.success) {
        return response.status(idResult.status ?? 400).json({ message: idResult.message });
      }

      const payload = dto.toUpdateInput();
      if (!payload.success) {
        return response.status(payload.status ?? 400).json({ message: payload.message });
      }

      const user = await this.userService.update(idResult.data, payload.data);

      return response.json(user);
    } catch (error) {
      return response.status(400).json({ message: (error as Error).message });
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const dto = UserRequestDto.fromRequest(request);
      const idResult = dto.getId();
      if (!idResult.success) {
        return response.status(idResult.status ?? 400).json({ message: idResult.message });
      }

      await this.userService.delete(idResult.data);
      return response.status(204).send();
    } catch (error) {
      return response.status(404).json({ message: (error as Error).message });
    }
  }

  async patch(request: Request, response: Response) {
    try {
      const dto = UserRequestDto.fromRequest(request);
      const idResult = dto.getId();
      if (!idResult.success) {
        return response.status(idResult.status ?? 400).json({ message: idResult.message });
      }

      const payload = dto.toUpdateInput();
      if (!payload.success) {
        return response.status(payload.status ?? 400).json({ message: payload.message });
      }

      const user = await this.userService.update(idResult.data, payload.data);

      return response.json(user);
    } catch (error) {
      return response.status(400).json({ message: (error as Error).message });
    }
  }
}

export { UserController };