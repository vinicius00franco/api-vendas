import { Request, Response } from "express";
import { CategoryService } from "./CategoryService.js";
import { CategoryRequestDto } from "./CategoryRequestDto.js";

class CategoryController {
  private readonly categoryService = new CategoryService();

  async create(request: Request, response: Response) {
    try {
      const dto = CategoryRequestDto.fromRequest(request);
      const payload = dto.toCreateInput();
      if (!payload.success) {
        return response.status(payload.status ?? 400).json({ message: payload.message });
      }

      const category = await this.categoryService.create(payload.data);

      return response.status(201).json(category);
    } catch (error) {
      return response.status(400).json({ message: (error as Error).message });
    }
  }

  async update(request: Request, response: Response) {
    try {
      const dto = CategoryRequestDto.fromRequest(request);
      const idResult = dto.getId();
      if (!idResult.success) {
        return response.status(idResult.status ?? 400).json({ message: idResult.message });
      }

      const payload = dto.toUpdateInput();
      if (!payload.success) {
        return response.status(payload.status ?? 400).json({ message: payload.message });
      }

      const category = await this.categoryService.update(idResult.data, payload.data);
      return response.json(category);
    } catch (error) {
      return response.status(400).json({ message: (error as Error).message });
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const dto = CategoryRequestDto.fromRequest(request);
      const idResult = dto.getId();
      if (!idResult.success) {
        return response.status(idResult.status ?? 400).json({ message: idResult.message });
      }

      await this.categoryService.delete(idResult.data);
      return response.status(204).send();
    } catch (error) {
      return response.status(404).json({ message: (error as Error).message });
    }
  }

  async patch(request: Request, response: Response) {
    try {
      const dto = CategoryRequestDto.fromRequest(request);
      const idResult = dto.getId();
      if (!idResult.success) {
        return response.status(idResult.status ?? 400).json({ message: idResult.message });
      }

      const payload = dto.toUpdateInput();
      if (!payload.success) {
        return response.status(payload.status ?? 400).json({ message: payload.message });
      }

      const category = await this.categoryService.update(idResult.data, payload.data);
      return response.json(category);
    } catch (error) {
      return response.status(400).json({ message: (error as Error).message });
    }
  }
}

export { CategoryController };