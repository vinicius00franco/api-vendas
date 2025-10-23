import { Request, Response } from "express";
import { JsonResponse } from "../../shared/http/JsonResponse.js";
import { BrandService } from "./BrandService.js";
import { BrandRequestDto } from "./BrandRequestDto.js";

class BrandController {
  private readonly brandService = new BrandService();

  async create(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = BrandRequestDto.fromRequest(request);
      const payload = dto.toCreateInput();
      if (!payload.success) {
        return responder.fromValidation(payload);
      }

      const brand = await this.brandService.create(payload.data);

      return responder.created(brand);
    } catch (error) {
      return responder.error((error as Error).message);
    }
  }

  async update(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = BrandRequestDto.fromRequest(request);
      const uuidResult = dto.getUuid();
      if (!uuidResult.success) {
        return responder.fromValidation(uuidResult);
      }

      const payload = dto.toUpdateInput();
      if (!payload.success) {
        return responder.fromValidation(payload);
      }

      const brand = await this.brandService.updateByUuid(uuidResult.data, payload.data);
      return responder.success(brand);
    } catch (error) {
      return responder.error((error as Error).message);
    }
  }

  async delete(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = BrandRequestDto.fromRequest(request);
      const uuidResult = dto.getUuid();
      if (!uuidResult.success) {
        return responder.fromValidation(uuidResult);
      }

      const deletedUuid = await this.brandService.deleteByUuid(uuidResult.data);
      return responder.success({ message: `Marca com UUID ${deletedUuid} foi deletada com sucesso` });
    } catch (error) {
      return responder.error((error as Error).message, { status: 404 });
    }
  }

  async patch(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = BrandRequestDto.fromRequest(request);
      const uuidResult = dto.getUuid();
      if (!uuidResult.success) {
        return responder.fromValidation(uuidResult);
      }

      const payload = dto.toUpdateInput();
      if (!payload.success) {
        return responder.fromValidation(payload);
      }

      const brand = await this.brandService.updateByUuid(uuidResult.data, payload.data);
      return responder.success(brand);
    } catch (error) {
      return responder.error((error as Error).message);
    }
  }

  async getAll(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const brands = await this.brandService.findAll();
      return responder.success(brands);
    } catch (error) {
      return responder.error((error as Error).message);
    }
  }

  async getById(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = BrandRequestDto.fromRequest(request);
      const uuidResult = dto.getUuid();
      if (!uuidResult.success) {
        return responder.fromValidation(uuidResult);
      }

      const brand = await this.brandService.findByUuid(uuidResult.data);
      if (!brand) {
        return responder.error("Marca não encontrada", { status: 404 });
      }

      return responder.success(brand);
    } catch (error) {
      return responder.error((error as Error).message);
    }
  }
}

export { BrandController };