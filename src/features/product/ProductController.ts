import { Request, Response } from "express";
import { ProductService, type UpdateProductInput } from "./ProductService.js";

class ProductController {
  private readonly productService = new ProductService();

  async create(request: Request, response: Response) {
    const { name, EAN, ean, price, description, categoryId } = request.body;
    try {
      const eanValue = ean ?? EAN;
      const numericPrice = Number(price);
      const numericCategoryId = Number(categoryId);

      if (!name || !eanValue || Number.isNaN(numericPrice) || Number.isNaN(numericCategoryId)) {
        return response.status(400).json({ message: "Dados do produto inválidos" });
      }

      const product = await this.productService.create({
        name,
        ean: eanValue,
        price: numericPrice,
        description,
        categoryId: numericCategoryId,
      });

      return response.status(201).json(product);
    } catch (error) {
      return response.status(400).json({
        message: (error as Error).message,
      });
    }
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, EAN, ean, price, description, categoryId } = request.body;
    try {
      const payload: UpdateProductInput = {};
      if (name !== undefined) payload.name = name;
      if (EAN !== undefined || ean !== undefined) payload.ean = ean ?? EAN;
      if (price !== undefined) {
        const numericPrice = Number(price);
        if (Number.isNaN(numericPrice)) {
          return response.status(400).json({ message: "Preço inválido" });
        }
        payload.price = numericPrice;
      }
      if (description !== undefined) payload.description = description;
      if (categoryId !== undefined) {
        const numericCategoryId = Number(categoryId);
        if (Number.isNaN(numericCategoryId)) {
          return response.status(400).json({ message: "Categoria inválida" });
        }
        payload.categoryId = numericCategoryId;
      }

      if (Object.keys(payload).length === 0) {
        return response.status(400).json({ message: "Nenhum dado informado para atualização" });
      }

      const product = await this.productService.update(Number(id), payload);

      return response.json(product);
    } catch (error) {
      return response.status(400).json({ message: (error as Error).message });
    }
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    try {
      await this.productService.delete(Number(id));
      return response.status(204).send();
    } catch (error) {
      return response.status(404).json({ message: (error as Error).message });
    }
  }

  async patch(request: Request, response: Response) {
    const { id } = request.params;
    const updates = request.body;
    try {
      const payload: UpdateProductInput = {};
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.EAN !== undefined || updates.ean !== undefined) {
        payload.ean = updates.ean ?? updates.EAN;
      }
      if (updates.price !== undefined) {
        const numericPrice = Number(updates.price);
        if (Number.isNaN(numericPrice)) {
          return response.status(400).json({ message: "Preço inválido" });
        }
        payload.price = numericPrice;
      }
      if (updates.description !== undefined) {
        payload.description = updates.description;
      }
      if (updates.categoryId !== undefined) {
        const numericCategoryId = Number(updates.categoryId);
        if (Number.isNaN(numericCategoryId)) {
          return response.status(400).json({ message: "Categoria inválida" });
        }
        payload.categoryId = numericCategoryId;
      }

      if (Object.keys(payload).length === 0) {
        return response.status(400).json({ message: "Nenhum dado informado para atualização" });
      }

      const product = await this.productService.update(Number(id), payload);

      return response.json(product);
    } catch (error) {
      return response.status(400).json({ message: (error as Error).message });
    }
  }
}

export { ProductController };