import { Request, Response } from "express";
import { CategoryService, type UpdateCategoryInput } from "./CategoryService.js";

class CategoryController {
  private readonly categoryService = new CategoryService();

  async create(request: Request, response: Response) {
    const { name, description } = request.body;
    try {
      if (!name) {
        return response.status(400).json({ message: "Nome da categoria é obrigatório" });
      }

      const category = await this.categoryService.create({
        name,
        description,
      });

      return response.status(201).json(category);
    } catch (error) {
      return response.status(400).json({ message: (error as Error).message });
    }
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, description } = request.body;
    try {
      const payload: UpdateCategoryInput = {};
      if (name !== undefined) payload.name = name;
      if (description !== undefined) payload.description = description;

      if (Object.keys(payload).length === 0) {
        return response.status(400).json({ message: "Nenhum dado informado para atualização" });
      }

      const category = await this.categoryService.update(Number(id), payload);
      return response.json(category);
    } catch (error) {
      return response.status(400).json({ message: (error as Error).message });
    }
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    try {
      await this.categoryService.delete(Number(id));
      return response.status(204).send();
    } catch (error) {
      return response.status(404).json({ message: (error as Error).message });
    }
  }

  async patch(request: Request, response: Response) {
    const { id } = request.params;
    const updates = request.body;
    try {
      const payload: UpdateCategoryInput = {};
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.description !== undefined) payload.description = updates.description;

      if (Object.keys(payload).length === 0) {
        return response.status(400).json({ message: "Nenhum dado informado para atualização" });
      }

      const category = await this.categoryService.update(Number(id), payload);
      return response.json(category);
    } catch (error) {
      return response.status(400).json({ message: (error as Error).message });
    }
  }
}

export { CategoryController };