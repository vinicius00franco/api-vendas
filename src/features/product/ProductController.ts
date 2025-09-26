import { Request, Response } from "express";
import { ProductService } from "./ProductService.js";
import { ProductRequestDto } from "./ProductRequestDto.js";

class ProductController {
  private readonly productService = new ProductService();

  async create(request: Request, response: Response) {
    try {
      const dto = ProductRequestDto.fromRequest(request);
      const payload = dto.toCreateInput();
      if (!payload.success) {
        return response.status(payload.status ?? 400).json({ message: payload.message });
      }

      const product = await this.productService.create(payload.data);

      return response.status(201).json(product);
    } catch (error) {
      return response.status(400).json({
        message: (error as Error).message,
      });
    }
  }

  async update(request: Request, response: Response) {
    try {
      const dto = ProductRequestDto.fromRequest(request);
      const idResult = dto.getId();
      if (!idResult.success) {
        return response.status(idResult.status ?? 400).json({ message: idResult.message });
      }

      const updateResult = dto.toUpdateInput();
      if (!updateResult.success) {
        return response.status(updateResult.status ?? 400).json({ message: updateResult.message });
      }

      const product = await this.productService.update(idResult.data, updateResult.data);

      return response.json(product);
    } catch (error) {
      return response.status(400).json({ message: (error as Error).message });
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const dto = ProductRequestDto.fromRequest(request);
      const idResult = dto.getId();
      if (!idResult.success) {
        return response.status(idResult.status ?? 400).json({ message: idResult.message });
      }

      await this.productService.delete(idResult.data);
      return response.status(204).send();
    } catch (error) {
      return response.status(404).json({ message: (error as Error).message });
    }
  }

  async patch(request: Request, response: Response) {
    try {
      const dto = ProductRequestDto.fromRequest(request);
      const idResult = dto.getId();
      if (!idResult.success) {
        return response.status(idResult.status ?? 400).json({ message: idResult.message });
      }

      const updateResult = dto.toUpdateInput();
      if (!updateResult.success) {
        return response.status(updateResult.status ?? 400).json({ message: updateResult.message });
      }

      const product = await this.productService.update(idResult.data, updateResult.data);

      return response.json(product);
    } catch (error) {
      return response.status(400).json({ message: (error as Error).message });
    }
  }
}

export { ProductController };