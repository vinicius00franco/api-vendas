import { Request, Response } from "express";

class DeleteCategoryController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;
    response.json({ message: "Categoria deletada com sucesso", id });
  }
}

export { DeleteCategoryController };