import { Request, Response } from "express";

class PatchCategoryController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;
    const updates = request.body;
    response.json({ message: "Categoria atualizada parcialmente", id, updates });
  }
}

export { PatchCategoryController };