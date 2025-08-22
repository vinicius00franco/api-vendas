import { Request, Response } from "express";

class CategoryController {
  async create(request: Request, response: Response) {
    const { name, description } = request.body;
    const category = { name, description };
    response.json({ message: "Categoria incluída com sucesso" });
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, description } = request.body;
    response.json({ message: "Categoria atualizada com sucesso", id });
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    response.json({ message: "Categoria deletada com sucesso", id });
  }

  async patch(request: Request, response: Response) {
    const { id } = request.params;
    const updates = request.body;
    response.json({ message: "Categoria atualizada parcialmente", id, updates });
  }
}

export { CategoryController };