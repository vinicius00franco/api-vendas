import { Request, Response } from "express";
import { JsonResponse } from "../../shared/http/JsonResponse.js";
import { CategoryService } from "./CategoryService.js";
import { CategoryRequestDto } from "./CategoryRequestDto.js";

class CategoryController {
  private readonly categoryService = new CategoryService();

  async create(request: Request, response: Response) {
    const categoryService = new CategoryService();
    const responder = JsonResponse.using(response);
    try {
      const dto = CategoryRequestDto.fromRequest(request);
      const payload = dto.toCreateInput();
      if (!payload.success) {
        return responder.fromValidation(payload);
      }

      const category = await categoryService.create(payload.data);

      return responder.created(category);
    } catch (error) {
      return responder.error((error as Error).message);
    }
  }

  async update(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = CategoryRequestDto.fromRequest(request);
      const uuidResult = dto.getUuid();
      if (!uuidResult.success) {
        return responder.fromValidation(uuidResult);
      }

      const payload = dto.toUpdateInput();
      if (!payload.success) {
        return responder.fromValidation(payload);
      }

      const category = await this.categoryService.updateByUuid(uuidResult.data, payload.data);
      return responder.success(category);
    } catch (error) {
      return responder.error((error as Error).message);
    }
  }

  async delete(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = CategoryRequestDto.fromRequest(request);
      const uuidResult = dto.getUuid();
      if (!uuidResult.success) {
        return responder.fromValidation(uuidResult);
      }

      const deletedUuid = await this.categoryService.deleteByUuid(uuidResult.data);
      return responder.success({ message: `Categoria com UUID ${deletedUuid} foi deletada com sucesso` });
    } catch (error) {
      return responder.error((error as Error).message, { status: 404 });
    }
  }

  async patch(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = CategoryRequestDto.fromRequest(request);
      const uuidResult = dto.getUuid();
      if (!uuidResult.success) {
        return responder.fromValidation(uuidResult);
      }

      const payload = dto.toUpdateInput();
      if (!payload.success) {
        return responder.fromValidation(payload);
      }

      const category = await this.categoryService.updateByUuid(uuidResult.data, payload.data);
      return responder.success(category);
    } catch (error) {
      return responder.error((error as Error).message);
    }
  }

  async getAll(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const categories = await this.categoryService.findAll();
      return responder.success(categories);
    } catch (error) {
      return responder.error((error as Error).message);
    }
  }

  async getById(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = CategoryRequestDto.fromRequest(request);
      const uuidResult = dto.getUuid();
      if (!uuidResult.success) {
        return responder.fromValidation(uuidResult);
      }

  const category = await this.categoryService.findByUuid(uuidResult.data);
      if (!category) {
        return responder.error("Categoria não encontrada", { status: 404 });
      }

      return responder.success(category);
    } catch (error) {
      return responder.error((error as Error).message);
    }
  }
}

export { CategoryController };