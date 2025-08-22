import { Request, Response } from "express";

class UpdateCategoryController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;
    const { name, description } = request.body;
    response.json({ message: "Categoria atualizada com sucesso", id });
  }
}

export { UpdateCategoryController };