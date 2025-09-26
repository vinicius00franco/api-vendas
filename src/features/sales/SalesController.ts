import { Request, Response } from "express";
import { SalesService } from "./SalesService.js";
import { SalesRequestDto } from "./SalesRequestDto.js";

class SalesController {
  private readonly salesService = new SalesService();

  async create(request: Request, response: Response) {
    try {
      const dto = SalesRequestDto.fromRequest(request);
      const payload = dto.toCreateInput();
      if (!payload.success) {
        return response.status(payload.status ?? 400).json({ message: payload.message });
      }

      const sale = await this.salesService.create(payload.data);

      return response.status(201).json(sale);
    } catch (error) {
      return response.status(400).json({ message: (error as Error).message });
    }
  }

  async update(request: Request, response: Response) {
    try {
      const dto = SalesRequestDto.fromRequest(request);
      const idResult = dto.getId();
      if (!idResult.success) {
        return response.status(idResult.status ?? 400).json({ message: idResult.message });
      }

      const payload = dto.toUpdateInput();
      if (!payload.success) {
        return response.status(payload.status ?? 400).json({ message: payload.message });
      }

      const sale = await this.salesService.update(idResult.data, payload.data);
      return response.json(sale);
    } catch (error) {
      return response.status(400).json({ message: (error as Error).message });
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const dto = SalesRequestDto.fromRequest(request);
      const idResult = dto.getId();
      if (!idResult.success) {
        return response.status(idResult.status ?? 400).json({ message: idResult.message });
      }

      await this.salesService.delete(idResult.data);
      return response.status(204).send();
    } catch (error) {
      return response.status(404).json({ message: (error as Error).message });
    }
  }

  async patch(request: Request, response: Response) {
    try {
      const dto = SalesRequestDto.fromRequest(request);
      const idResult = dto.getId();
      if (!idResult.success) {
        return response.status(idResult.status ?? 400).json({ message: idResult.message });
      }

      const payload = dto.toUpdateInput();
      if (!payload.success) {
        return response.status(payload.status ?? 400).json({ message: payload.message });
      }

      const sale = await this.salesService.update(idResult.data, payload.data);
      return response.json(sale);
    } catch (error) {
      return response.status(400).json({ message: (error as Error).message });
    }
  }
}

export { SalesController };