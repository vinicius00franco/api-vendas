import { Request, Response } from "express";
import { JsonResponse } from "../../shared/http/JsonResponse.js";
import { ProductService } from "./ProductService.js";
import { ProductRequestDto } from "./ProductRequestDto.js";

class ProductController {
  private readonly productService = new ProductService();

  async create(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = ProductRequestDto.fromRequest(request);
      const payload = dto.toCreateInput();
      if (!payload.success) {
        return responder.fromValidation(payload);
      }

      const product = await this.productService.create(payload.data);

      return responder.created(product);
    } catch (error) {
      return responder.error((error as Error).message);
    }
  }

  async update(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = ProductRequestDto.fromRequest(request);
      const idResult = dto.getId();
      if (!idResult.success) {
        return responder.fromValidation(idResult);
      }

      const updateResult = dto.toUpdateInput();
      if (!updateResult.success) {
        return responder.fromValidation(updateResult);
      }

      const product = await this.productService.update(idResult.data, updateResult.data);

      return responder.success(product);
    } catch (error) {
      return responder.error((error as Error).message);
    }
  }

  async delete(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = ProductRequestDto.fromRequest(request);
      const idResult = dto.getId();
      if (!idResult.success) {
        return responder.fromValidation(idResult);
      }

      await this.productService.delete(idResult.data);
      return responder.noContent();
    } catch (error) {
      return responder.error((error as Error).message, { status: 404 });
    }
  }

  async patch(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = ProductRequestDto.fromRequest(request);
      const idResult = dto.getId();
      if (!idResult.success) {
        return responder.fromValidation(idResult);
      }

      const updateResult = dto.toUpdateInput();
      if (!updateResult.success) {
        return responder.fromValidation(updateResult);
      }

      const product = await this.productService.update(idResult.data, updateResult.data);

      return responder.success(product);
    } catch (error) {
      return responder.error((error as Error).message);
    }
  }
}

export { ProductController };