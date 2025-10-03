import { Request, Response } from "express";
import { JsonResponse } from "../../shared/http/JsonResponse.js";
import { SalesService } from "./SalesService.js";
import { SalesRequestDto } from "./SalesRequestDto.js";

class SalesController {
  private readonly salesService = new SalesService();

  async create(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = SalesRequestDto.fromRequest(request);
      const payload = dto.toCreateInput();
      if (!payload.success) {
        return responder.fromValidation(payload);
      }

      const sale = await this.salesService.create(payload.data);

      return responder.created(sale);
    } catch (error) {
      return responder.error((error as Error).message);
    }
  }

  async update(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = SalesRequestDto.fromRequest(request);
      const uuidResult = dto.getUuid();
      if (!uuidResult.success) {
        return responder.fromValidation(uuidResult);
      }

      const payload = dto.toUpdateInput();
      if (!payload.success) {
        return responder.fromValidation(payload);
      }

      const sale = await this.salesService.updateByUuid(uuidResult.data, payload.data);
      return responder.success(sale);
    } catch (error) {
      return responder.error((error as Error).message);
    }
  }

  async delete(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = SalesRequestDto.fromRequest(request);
      const uuidResult = dto.getUuid();
      if (!uuidResult.success) {
        return responder.fromValidation(uuidResult);
      }

      await this.salesService.deleteByUuid(uuidResult.data);
      return responder.noContent();
    } catch (error) {
      return responder.error((error as Error).message, { status: 404 });
    }
  }

  async patch(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = SalesRequestDto.fromRequest(request);
      const uuidResult = dto.getUuid();
      if (!uuidResult.success) {
        return responder.fromValidation(uuidResult);
      }

      const payload = dto.toUpdateInput();
      if (!payload.success) {
        return responder.fromValidation(payload);
      }

      const sale = await this.salesService.updateByUuid(uuidResult.data, payload.data);
      return responder.success(sale);
    } catch (error) {
      return responder.error((error as Error).message);
    }
  }

  async getAll(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const sales = await this.salesService.findAll();
      return responder.success(sales);
    } catch (error) {
      return responder.error((error as Error).message);
    }
  }

  async getById(request: Request, response: Response) {
    const responder = JsonResponse.using(response);
    try {
      const dto = SalesRequestDto.fromRequest(request);
      const uuidResult = dto.getUuid();
      if (!uuidResult.success) {
        return responder.fromValidation(uuidResult);
      }

      const sale = await this.salesService.findByUuid(uuidResult.data);
      if (!sale) {
        return responder.error("Venda não encontrada", { status: 404 });
      }

      return responder.success(sale);
    } catch (error) {
      return responder.error((error as Error).message);
    }
  }
}

export { SalesController };