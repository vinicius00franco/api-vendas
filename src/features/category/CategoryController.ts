import { Request, Response } from "express";
import { JsonResponse } from "../../shared/http/JsonResponse.js";
import { CategoryService } from "./CategoryService.js";
import { CategoryRequestDto } from "./CategoryRequestDto.js";

class CategoryController {
  private readonly categoryService = new CategoryService();

  async create(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = CategoryRequestDto.fromRequest(request);
      const payload = dto.toCreateInput();
      if (!payload.success) {
        return responder.fromValidation(payload);
      }

      const category = await this.categoryService.create(payload.data);

      return responder.created(category);
    } catch (error) {
      return responder.error((error as Error).message);
    }
  }

  async update(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = CategoryRequestDto.fromRequest(request);
      const idResult = dto.getId();
      if (!idResult.success) {
        return responder.fromValidation(idResult);
      }

      const payload = dto.toUpdateInput();
      if (!payload.success) {
        return responder.fromValidation(payload);
      }

      const category = await this.categoryService.update(idResult.data, payload.data);
      return responder.success(category);
    } catch (error) {
      return responder.error((error as Error).message);
    }
  }

  async delete(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = CategoryRequestDto.fromRequest(request);
      const idResult = dto.getId();
      if (!idResult.success) {
        return responder.fromValidation(idResult);
      }

      await this.categoryService.delete(idResult.data);
      return responder.noContent();
    } catch (error) {
      return responder.error((error as Error).message, { status: 404 });
    }
  }

  async patch(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = CategoryRequestDto.fromRequest(request);
      const idResult = dto.getId();
      if (!idResult.success) {
        return responder.fromValidation(idResult);
      }

      const payload = dto.toUpdateInput();
      if (!payload.success) {
        return responder.fromValidation(payload);
      }

      const category = await this.categoryService.update(idResult.data, payload.data);
      return responder.success(category);
    } catch (error) {
      return responder.error((error as Error).message);
    }
  }
}

export { CategoryController };